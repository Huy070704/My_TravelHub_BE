import { db } from './index';
import { users } from '../modules/users/user.schema';
import { destinations } from '../modules/destinations/destination.schema';
import { tours } from '../modules/tours/tour.schema';

async function main() {
  console.log('Seeding database...');

  try {
    // 1. Seed Users
    const newUsers = await db.insert(users).values([
      {
        username: 'admin_user',
        email: 'admin@travelhub.com',
        fullName: 'Admin TravelHub',
        role: 'Admin',
        passwordHash: 'hashed_password_example', // Thay bằng hash thật (vd: bcrypt)
      },
      {
        username: 'customer_01',
        email: 'customer1@gmail.com',
        fullName: 'Nguyen Van A',
        role: 'Customer',
        isPremium: true,
      }
    ]).returning();

    console.log('Users seeded:', newUsers.length);

    // 2. Seed Destinations
    const newDestinations = await db.insert(destinations).values([
      {
        name: 'Vịnh Hạ Long',
        cityProvince: 'Quảng Ninh',
        description: 'Di sản thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi kỳ vĩ.',
        rate: '4.8',
        entranceFee: '250000',
      },
      {
        name: 'Bà Nà Hills',
        cityProvince: 'Đà Nẵng',
        description: 'Đường lên tiên cảnh với Cầu Vàng nổi tiếng.',
        rate: '4.7',
        entranceFee: '900000',
      }
    ]).returning();

    console.log('Destinations seeded:', newDestinations.length);

    // 3. Seed Tours
    const newTours = await db.insert(tours).values([
      {
        slug: 'tour-ha-long-2n1d',
        title: 'Khám phá Vịnh Hạ Long 2 Ngày 1 Đêm',
        destination: 'Hạ Long',
        departureLocation: 'Hà Nội',
        departureDate: new Date('2026-10-10'),
        durationDays: 2,
        durationText: '2 Ngày 1 Đêm',
        priceVND: 1500000,
        providerID: newUsers[0].userID,
        description: 'Du thuyền 4 sao tham quan các hang động đẹp nhất.',
      },
      {
        slug: 'tour-ba-na-hills-1n',
        title: 'Tham quan Bà Nà Hills trong ngày',
        destination: 'Đà Nẵng',
        departureLocation: 'Đà Nẵng',
        departureDate: new Date('2026-11-05'),
        durationDays: 1,
        durationText: '1 Ngày',
        priceVND: 1200000,
        providerID: newUsers[0].userID,
        description: 'Trải nghiệm cáp treo và tham quan Cầu Vàng.',
      },
      {
        slug: 'tour-phu-quoc-3n2d',
        title: 'Nghỉ dưỡng Phú Quốc 3 Ngày 2 Đêm',
        destination: 'Phú Quốc',
        departureLocation: 'Hồ Chí Minh',
        departureDate: new Date('2026-12-20'),
        durationDays: 3,
        durationText: '3 Ngày 2 Đêm',
        priceVND: 4500000,
        providerID: newUsers[0].userID,
        description: 'Tham quan Safari và vui chơi tại VinWonders.',
      },
      {
        slug: 'tour-da-lat-4n3d',
        title: 'Trải nghiệm Đà Lạt mộng mơ',
        destination: 'Đà Lạt',
        departureLocation: 'Hồ Chí Minh',
        departureDate: new Date('2026-10-15'),
        durationDays: 4,
        durationText: '4 Ngày 3 Đêm',
        priceVND: 3200000,
        providerID: newUsers[0].userID,
        description: 'Check-in những địa điểm hot nhất Đà Lạt.',
      },
      {
        slug: 'tour-nha-trang-3n2d',
        title: 'Biển xanh Nha Trang',
        destination: 'Nha Trang',
        departureLocation: 'Hà Nội',
        departureDate: new Date('2026-11-15'),
        durationDays: 3,
        durationText: '3 Ngày 2 Đêm',
        priceVND: 3800000,
        providerID: newUsers[0].userID,
        description: 'Lặn ngắm san hô và thưởng thức hải sản.',
      },
      {
        slug: 'tour-sapa-2n1d',
        title: 'Chinh phục Fansipan Sapa',
        destination: 'Sapa',
        departureLocation: 'Hà Nội',
        departureDate: new Date('2026-09-30'),
        durationDays: 2,
        durationText: '2 Ngày 1 Đêm',
        priceVND: 2500000,
        providerID: newUsers[0].userID,
        description: 'Leo núi và tìm hiểu văn hóa bản địa.',
      }
    ]).returning();

    console.log('Tours seeded:', newTours.length);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

main();
