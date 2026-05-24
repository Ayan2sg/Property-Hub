import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ListingApprovalStatus, PaymentStatus, PrismaClient, PropertyStatus, Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
type PropertyRequestBody = {
  title?: string;
  price?: string;
  location?: string;
  beds?: number | string;
  baths?: number | string;
  sqft?: string;
  image?: string;
  type?: string;
  featured?: boolean;
  amenities?: string[];
  availableFrom?: string | null;
};
type AuthenticatedRequest = express.Request & { userId?: string; userRole?: Role };

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:8080',
      'http://localhost:8081',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081'
    ].filter((value): value is string => !!value);
    if (!origin || allowed.includes(origin)) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
// Auth helpers
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
function signToken(userId: string, role: Role) {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: '7d' });
}
function authMiddleware(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; role?: Role };
    req.userId = payload.sub;
    req.userRole = payload.role || Role.USER;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
function adminMiddleware(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  authMiddleware(req, res, () => {
    if (req.userRole !== Role.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}
function userResponse(user: { id: string; name: string; email: string; role: Role }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
function publicPropertyWhere(extra: Record<string, unknown> = {}) {
  return { approvalStatus: ListingApprovalStatus.APPROVED, ...extra };
}

function parseAmenities(raw: string) {
  try {
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

function toPropertyResponse(property: any) {
  return { ...property, amenities: parseAmenities(property.amenities) };
}

function normalizeType(type?: string) {
  if (!type) return null;
  const upper = type.toUpperCase();
  return upper === 'SALE' || upper === 'RENT' ? upper : null;
}

function validatePropertyBody(body: PropertyRequestBody) {
  const required = ['title', 'price', 'location', 'sqft', 'image', 'type'] as const;
  for (const field of required) {
    if (!body[field]) {
      return `${field} is required`;
    }
  }
  const beds = Number(body.beds);
  const baths = Number(body.baths);
  if (!Number.isInteger(beds) || beds <= 0) return 'beds must be a positive integer';
  if (!Number.isInteger(baths) || baths <= 0) return 'baths must be a positive integer';
  if (!normalizeType(body.type)) return 'type must be SALE or RENT';
  return null;
}

function getAmountInPaise(price: string) {
  const numericPrice = Number(String(price).replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    throw new Error('Invalid property price for payment');
  }
  return Math.round(numericPrice * 100);
}

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash, role: Role.USER } });
    const token = signToken(user.id, user.role);
    res.json({ token, user: userResponse(user) });
  } catch (e) {
    console.error('Error signup:', e);
    res.status(500).json({ error: 'Failed to signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user.id, user.role);
    res.json({ token, user: userResponse(user) });
  } catch (e) {
    console.error('Error login:', e);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== Role.ADMIN) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid admin credentials' });
    const token = signToken(user.id, user.role);
    res.json({ token, user: userResponse(user) });
  } catch (e) {
    console.error('Error admin login:', e);
    res.status(500).json({ error: 'Failed to login as admin' });
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Prop Haven API is running' });
});

// Properties routes
app.get('/api/properties', async (req, res) => {
  try {
    const { type, search, limit = '10', offset = '0' } = req.query;
    
    const where: any = publicPropertyWhere();
    
    if (type && type !== 'all' && typeof type === 'string') {
      where.type = type.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { location: { contains: search as string } }
      ];
    }
    
    const properties = await prisma.property.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse amenities JSON strings back to arrays
    const propertiesWithParsedAmenities = properties.map(toPropertyResponse);
    
    res.json(propertiesWithParsedAmenities);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findFirst({
      where: { id, ...publicPropertyWhere() }
    });
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Parse amenities JSON string back to array
    const propertyWithParsedAmenities = toPropertyResponse(property);
    
    res.json(propertyWithParsedAmenities);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

app.post('/api/properties', authMiddleware, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { title, price, location, beds, baths, sqft, image, type, featured, amenities, availableFrom } = req.body as PropertyRequestBody;
    const validationError = validatePropertyBody(req.body as PropertyRequestBody);
    if (validationError) return res.status(400).json({ error: validationError });
    const normalizedType = normalizeType(type)!;
    const property = await prisma.property.create({
      data: {
        title: title!,
        price: price!,
        location: location!,
        beds: Number(beds),
        baths: Number(baths),
        sqft: sqft!,
        image: image!,
        type: normalizedType,
        status: PropertyStatus.AVAILABLE,
        approvalStatus: ListingApprovalStatus.PENDING,
        featured: false,
        amenities: JSON.stringify(amenities || []),
        availableFrom: availableFrom || null,
        listedById: authReq.userId
      }
    });
    
    // Parse amenities JSON string back to array
    const propertyWithParsedAmenities = toPropertyResponse(property);
    
    res.status(201).json(propertyWithParsedAmenities);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Purchase a property (mark SOLD for SALE listings, RENTED for RENT listings)
app.post('/api/properties/:id/purchase', authMiddleware, async (req, res) => {
  return res.status(410).json({
    error: 'Direct purchase is disabled. Use the Razorpay payment flow to complete checkout securely.'
  });
});

app.post('/api/payments/razorpay/order', authMiddleware, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.userId) return res.status(401).json({ error: 'Unauthorized' });
    const { propertyId } = req.body as { propertyId?: string };
    if (!propertyId) return res.status(400).json({ error: 'propertyId is required' });

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ...publicPropertyWhere() }
    });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.status !== PropertyStatus.AVAILABLE) {
      return res.status(409).json({ error: `Property is already ${property.status.toLowerCase()}` });
    }

    const amount = getAmountInPaise(property.price);
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `prop_${property.id.slice(0, 12)}_${Date.now()}`
    });

    await prisma.payment.create({
      data: {
        userId: authReq.userId,
        propertyId: property.id,
        razorpayOrderId: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        status: PaymentStatus.CREATED
      }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      propertyId: property.id
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create payment order' });
  }
});

app.post('/api/payments/razorpay/verify', authMiddleware, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.userId) return res.status(401).json({ error: 'Unauthorized' });
    const { propertyId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
      propertyId?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!propertyId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: 'Razorpay secret is not configured' });

    const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
    if (!payment || payment.userId !== authReq.userId || payment.propertyId !== propertyId) {
      return res.status(400).json({ error: 'Payment order not found or does not match request' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      await prisma.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: PaymentStatus.FAILED,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        }
      });
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ...publicPropertyWhere() }
    });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.status !== PropertyStatus.AVAILABLE) {
      return res.status(409).json({ error: `Property is already ${property.status.toLowerCase()}` });
    }

    const newStatus = property.type === 'SALE' ? PropertyStatus.SOLD : PropertyStatus.RENTED;
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { status: newStatus }
    });

    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: PaymentStatus.VERIFIED,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        verifiedAt: new Date()
      }
    });

    res.json({ success: true, property: toPropertyResponse(updated) });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

app.post('/api/payments/upi/confirm', authMiddleware, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.userId) return res.status(401).json({ error: 'Unauthorized' });

    const { propertyId, utr } = req.body as { propertyId?: string; utr?: string };
    if (!propertyId || !utr) return res.status(400).json({ error: 'propertyId and utr are required' });

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ...publicPropertyWhere() }
    });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.status !== PropertyStatus.AVAILABLE) {
      return res.status(409).json({ error: `Property is already ${property.status.toLowerCase()}` });
    }

    const amount = getAmountInPaise(property.price);
    const now = Date.now();
    const manualOrderId = `upi_manual_${property.id.slice(0, 12)}_${now}`;

    const updated = await prisma.$transaction(async (tx) => {
      const newStatus = property.type === 'SALE' ? PropertyStatus.SOLD : PropertyStatus.RENTED;
      const nextProperty = await tx.property.update({
        where: { id: propertyId },
        data: { status: newStatus }
      });

      await tx.payment.create({
        data: {
          userId: authReq.userId!,
          propertyId: propertyId,
          razorpayOrderId: manualOrderId,
          razorpayPaymentId: utr.trim(),
          razorpaySignature: 'manual_upi_confirmation',
          amount,
          currency: 'INR',
          status: PaymentStatus.VERIFIED,
          verifiedAt: new Date()
        }
      });

      return nextProperty;
    });

    res.json({ success: true, property: toPropertyResponse(updated) });
  } catch (error) {
    console.error('Error confirming UPI payment:', error);
    res.status(500).json({ error: 'Failed to confirm UPI payment' });
  }
});

app.put('/api/properties/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, location, beds, baths, sqft, image, type, featured, amenities, availableFrom } = req.body as PropertyRequestBody;
    const validationError = validatePropertyBody(req.body as PropertyRequestBody);
    if (validationError) return res.status(400).json({ error: validationError });
    const normalizedType = normalizeType(type)!;
    const property = await prisma.property.update({
      where: { id },
      data: {
        title: title!,
        price: price!,
        location: location!,
        beds: Number(beds),
        baths: Number(baths),
        sqft: sqft!,
        image: image!,
        type: normalizedType,
        featured: featured || false,
        amenities: JSON.stringify(amenities || []),
        availableFrom: availableFrom || null
      }
    });
    
    // Parse amenities JSON string back to array
    const propertyWithParsedAmenities = toPropertyResponse(property);
    
    res.json(propertyWithParsedAmenities);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.get('/api/admin/properties', adminMiddleware, async (req, res) => {
  try {
    const { approval = 'all' } = req.query;
    const where: Record<string, unknown> = {};
    if (approval !== 'all' && typeof approval === 'string') {
      const normalized = approval.toUpperCase();
      if (['PENDING', 'APPROVED', 'REJECTED'].includes(normalized)) {
        where.approvalStatus = normalized;
      }
    }
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        listedBy: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(properties.map(toPropertyResponse));
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties for admin' });
  }
});

app.patch('/api/admin/properties/:id/approve', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.update({
      where: { id },
      data: { approvalStatus: ListingApprovalStatus.APPROVED }
    });
    res.json(toPropertyResponse(property));
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ error: 'Failed to approve property' });
  }
});

app.patch('/api/admin/properties/:id/reject', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.update({
      where: { id },
      data: { approvalStatus: ListingApprovalStatus.REJECTED }
    });
    res.json(toPropertyResponse(property));
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({ error: 'Failed to reject property' });
  }
});

app.delete('/api/admin/properties/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.property.delete({ where: { id } });
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Prop Haven API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});
