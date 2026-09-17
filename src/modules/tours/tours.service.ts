import { and, gte, lte, ilike, count, SQL, desc, asc, eq } from 'drizzle-orm';
import { db } from '../../db';
import { tours } from './tour.schema';

// 1. Khai báo các Type DTO chính xác cho Input từ Controller
export interface GetToursParams {
  page?: number;
  limit?: number;
  search?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'priceAsc' | 'priceDesc' | 'newest';
}

export interface CreateTourInput {
  slug: string;
  title: string;
  destination: string;
  departureLocation: string;
  departureDate: Date;
  durationDays: number;
  durationText?: string;
  priceVND: number;
  imageUrl?: string;
  status?: 'draft' | 'published' | 'archived';
  description?: string;
  providerID: string; // Được truyền từ req.user.userId
}

export type UpdateTourInput = Partial<Omit<CreateTourInput, 'providerID'>>;

export class ToursService {
  // GET ALL - Lấy danh sách tour có phân trang và lọc
  static async getAll(params: GetToursParams = {}) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (params.search) conditions.push(ilike(tours.title, `%${params.search}%`));
    if (params.destination) conditions.push(ilike(tours.destination, `%${params.destination}%`));
    if (params.minPrice !== undefined) conditions.push(gte(tours.priceVND, params.minPrice));
    if (params.maxPrice !== undefined) conditions.push(lte(tours.priceVND, params.maxPrice));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause = desc(tours.departureDate);
    if (params.sortBy === 'priceAsc') orderByClause = asc(tours.priceVND);
    if (params.sortBy === 'priceDesc') orderByClause = desc(tours.priceVND);

    const [data, totalResult] = await Promise.all([
      db.select().from(tours).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset),
      db.select({ total: count() }).from(tours).where(whereClause),
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      tours: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET BY SLUG
  static async getBySlug(slug: string) {
    const [tour] = await db.select().from(tours).where(eq(tours.slug, slug)).limit(1);
    return tour || null;
  }

  // GET BY ID (Helper)
  static async getById(id: number) {
    const [tour] = await db.select().from(tours).where(eq(tours.tourID, id)).limit(1);
    return tour || null;
  }

  // CREATE TOUR - Nhận đúng CreateTourInput đã qua Zod Validate
  static async create(input: CreateTourInput) {
    const [newTour] = await db
      .insert(tours)
      .values(input)
      .returning();

    return newTour;
  }

  // UPDATE TOUR - Nhận đúng UpdateTourInput
  static async update(id: number, input: UpdateTourInput) {
    if (Object.keys(input).length === 0) {
      return this.getById(id);
    }

    const updateData: Record<string, any> = { ...input };

    // Không cần convert priceVND vì Drizzle config mode: 'number' rồi

    const [updatedTour] = await db
      .update(tours)
      .set(updateData)
      .where(eq(tours.tourID, id))
      .returning();

    return updatedTour || null;
  }

  // DELETE TOUR
  static async delete(id: number) {
    const [deletedTour] = await db
      .delete(tours)
      .where(eq(tours.tourID, id))
      .returning();

    return deletedTour || null;
  }
}