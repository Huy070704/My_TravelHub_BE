import { Request, Response } from 'express';
import { z } from 'zod';
import { ToursService } from './tours.service';

export const ToursController = {
  // GET /tours - Lấy danh sách tour (Phân trang, Lọc, Tìm kiếm, Sắp xếp)
  async getAll(req: Request, res: Response) {
    try {
      // 1. Validate và transform trực tiếp req.query bằng Zod
      const queryParams = z
        .object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(10),
          search: z.string().trim().optional(),
          destination: z.string().trim().optional(),
          minPrice: z.coerce.number().min(0).optional(),
          maxPrice: z.coerce.number().min(0).optional(),
          sortBy: z.enum(['priceAsc', 'priceDesc', 'newest']).default('newest'),
        })
        .parse(req.query);

      // 2. Gọi Service xử lý truy vấn Database
      const result = await ToursService.getAll(queryParams);

      // 3. Trả về kết quả thành công
      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách tour thành công',
        data: result.tours,
        pagination: result.pagination,
      });
    } catch (error: unknown) {
      // Bắt lỗi validate tham số từ Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Tham số truy vấn không hợp lệ',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      console.error('Error in getAll tours:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách chuyến đi',
      });
    }
  },
};