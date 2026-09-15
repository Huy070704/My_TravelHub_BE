import { and, gte, lte, ilike, count, SQL, desc, asc } from 'drizzle-orm';
import { db } from '../../db';
import { tours } from './tour.schema';

export interface GetToursParams {
  page?: number;
  limit?: number;
  search?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'priceAsc' | 'priceDesc' | 'newest';
}

export class ToursService {
  static async getAll(params: GetToursParams = {}) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const offset = (page - 1) * limit;

    // 1. Dựng điều kiện WHERE
    const conditions: SQL[] = [];

    if (params.search) {
      conditions.push(ilike(tours.title, `%${params.search}%`));
    }
    if (params.destination) {
      conditions.push(ilike(tours.destination, `%${params.destination}%`));
    }
    if (params.minPrice !== undefined) {
      conditions.push(gte(tours.priceVND, params.minPrice));
    }
    if (params.maxPrice !== undefined) {
      conditions.push(lte(tours.priceVND, params.maxPrice));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 2. Dựng điều kiện ORDER BY
    let orderByClause = desc(tours.departureDate);
    if (params.sortBy === 'priceAsc') orderByClause = asc(tours.priceVND);
    if (params.sortBy === 'priceDesc') orderByClause = desc(tours.priceVND);

    // 3. Query dữ liệu + Tổng số lượng song song để tối ưu tốc độ
    // lay danh sach tour theo user chon + lay tong so luong tour theo dieu kien loc
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(tours)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(tours)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      tours: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit), // lam tron len de hien thi so trang
      },
    };
  }
}