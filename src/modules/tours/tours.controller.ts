import { Request, Response } from 'express';
import { z } from 'zod';
import { ToursService } from './tours.service';

// 1. Khai báo Zod Schema chung ở cấp module để tái sử dụng cho Create & Update
const baseTourSchema = z.object({
  slug: z.string().trim().min(1, 'Slug là bắt buộc'),
  title: z.string().trim().min(1, 'Title là bắt buộc'),
  destination: z.string().trim().min(1, 'Destination là bắt buộc'),
  departureLocation: z.string().trim().min(1, 'Departure location là bắt buộc'),
  departureDate: z.coerce.date(),
  durationDays: z.coerce.number().int().min(1),
  durationText: z.string().trim().optional(),
  priceVND: z.coerce.number().min(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  description: z.string().optional(),
});

// Helper handle ZodError gọn gàng
const handleZodError = (res: Response, error: z.ZodError) => {
  return res.status(400).json({
    success: false,
    message: 'Dữ liệu không hợp lệ',
    errors: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  });
};

export const ToursController = {
  // GET /tours - Lấy danh sách tour
  async getAll(req: Request, res: Response) {
    try {
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

      const result = await ToursService.getAll(queryParams);

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách tour thành công',
        data: result.tours,
        pagination: result.pagination,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) return handleZodError(res, error);

      console.error('Error in getAll tours:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách chuyến đi' });
    }
  },

  // GET /tours/:slug - Lấy chi tiết tour theo slug
  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = z
        .object({
          slug: z.string().trim().min(1, 'Slug là bắt buộc'),
        })
        .parse(req.params);

      const tour = await ToursService.getBySlug(slug);

      if (!tour) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy tour' });
      }

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin tour thành công',
        data: tour,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) return handleZodError(res, error);

      console.error('Error in getBySlug tour:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết tour' });
    }
  },

  // POST /tours - Tạo tour mới
  async create(req: Request, res: Response) {
    try {
      const providerID = req.user?.userId as string;
      if (!providerID) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const data = baseTourSchema.parse(req.body);

      const newTour = await ToursService.create({ ...data, providerID });

      return res.status(201).json({
        success: true,
        message: 'Tạo tour thành công',
        data: newTour,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) return handleZodError(res, error);

      console.error('Error in create tour:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi tạo tour' });
    }
  },

  // PUT /tours/:id - Cập nhật tour
  async update(req: Request, res: Response) {
    try {
      // Validate tourID trực tiếp bằng Zod coerce
      const { id: tourID } = z
        .object({
          id: z.coerce.number().int().positive('ID không hợp lệ'),
        })
        .parse(req.params);

      // Tái sử dụng baseTourSchema với .partial() (chuyen tat ca du lieu thanh ko bat buoc)
      const data = baseTourSchema.partial().parse(req.body);

      const updatedTour = await ToursService.update(tourID, data);

      if (!updatedTour) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy tour' });
      }

      return res.status(200).json({
        success: true,
        message: 'Cập nhật tour thành công',
        data: updatedTour,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) return handleZodError(res, error);

      console.error('Error in update tour:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật tour' });
    }
  },

  // DELETE /tours/:id - Xóa tour
  async delete(req: Request, res: Response) {
    try {
      const { id: tourID } = z
        .object({
          id: z.coerce.number().int().positive('ID không hợp lệ'),
        })
        .parse(req.params);

      const deletedTour = await ToursService.delete(tourID);

      if (!deletedTour) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy tour' });
      }

      return res.status(200).json({
        success: true,
        message: 'Xóa tour thành công',
        data: deletedTour,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) return handleZodError(res, error);

      console.error('Error in delete tour:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi xóa tour' });
    }
  },
};