const { sequelize, User, Store, Rating } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🔄 Synchronizing database tables...');
    await sequelize.sync({ force: true }); // Resets tables and creates schema
    console.log('✅ Tables synchronized successfully.');

    console.log('🌱 Seeding initial users...');

    // 1. Create System Admin
    const admin = await User.create({
      name: 'System Administrator Main Account', // 34 chars (valid: 20-60)
      email: 'admin@storerating.com',
      password: 'Admin@Password123', // valid: 8-16 chars, 1 uppercase, 1 special
      address: 'Suite 101, Executive Tower, Silicon Valley, CA',
      role: 'SYSTEM_ADMIN',
    });

    // 2. Create Store Owners
    const owner1 = await User.create({
      name: 'Alexander Graham Store Owner', // 28 chars
      email: 'alexander.owner@store.com',
      password: 'Owner@Password123',
      address: '450 North Market Street, Business District, Metro City',
      role: 'STORE_OWNER',
    });

    const owner2 = await User.create({
      name: 'Christopher Nolan Store Owner', // 29 chars
      email: 'nolan.owner@store.com',
      password: 'Owner@Password123',
      address: '780 West Plaza Avenue, Commercial Square, Metro City',
      role: 'STORE_OWNER',
    });

    const owner3 = await User.create({
      name: 'Elizabeth Montgomery Store Owner', // 32 chars
      email: 'elizabeth.owner@store.com',
      password: 'Owner@Password123',
      address: '120 Sunset Boulevard, Harbor Waterfront, Coast City',
      role: 'STORE_OWNER',
    });

    // 3. Create Normal Users
    const user1 = await User.create({
      name: 'Jonathan Edward Normal User One', // 31 chars
      email: 'jonathan.user@gmail.com',
      password: 'User@Password123',
      address: '12 Blossom Way, Springfield Residential Area, City 1',
      role: 'NORMAL_USER',
    });

    const user2 = await User.create({
      name: 'Benjamin Franklin Normal User Two', // 33 chars
      email: 'benjamin.user@gmail.com',
      password: 'User@Password123',
      address: '56 Elmwood Crescent, Maplewood Neighborhood, City 2',
      role: 'NORMAL_USER',
    });

    const user3 = await User.create({
      name: 'Catherine Elizabeth Normal User Three', // 37 chars
      email: 'catherine.user@gmail.com',
      password: 'User@Password123',
      address: '89 Willowbrook Road, Lakeside Gardens, City 3',
      role: 'NORMAL_USER',
    });

    console.log('✅ Users seeded successfully.');

    // 4. Create Stores
    console.log('🌱 Seeding stores...');
    const store1 = await Store.create({
      name: 'Organic Grocery Supermarket Central', // 35 chars (20-60)
      email: 'central.organic@grocery.com',
      address: 'Building 14, Organic Food Hub, Main Market Street, Metro City',
      ownerId: owner1.id,
    });

    const store2 = await Store.create({
      name: 'Apex Digital Electronics Megastore', // 35 chars (20-60)
      email: 'support@apexelectronics.com',
      address: 'Floor 2, Apex Tech Mall, Cyber City Highway, Silicon Valley',
      ownerId: owner2.id,
    });

    const store3 = await Store.create({
      name: 'Grand Horizon Bookshop And Cafe Shop', // 37 chars (20-60)
      email: 'contact@grandhorizonbooks.com',
      address: '400 Old Town Square, Cultural Heritage Lane, Coast City',
      ownerId: owner3.id,
    });

    console.log('✅ Stores seeded successfully.');

    // 5. Seed Initial Ratings
    console.log('🌱 Seeding ratings...');
    await Rating.bulkCreate([
      { userId: user1.id, storeId: store1.id, rating: 5 },
      { userId: user2.id, storeId: store1.id, rating: 4 },
      { userId: user3.id, storeId: store1.id, rating: 5 },

      { userId: user1.id, storeId: store2.id, rating: 4 },
      { userId: user2.id, storeId: store2.id, rating: 3 },

      { userId: user2.id, storeId: store3.id, rating: 5 },
      { userId: user3.id, storeId: store3.id, rating: 4 },
    ]);

    console.log('✅ Ratings seeded successfully.');
    console.log('\n========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================');
    console.log('Admin Account:');
    console.log('  Email:    admin@storerating.com');
    console.log('  Password: Admin@Password123');
    console.log('\nStore Owner Accounts:');
    console.log('  Email:    alexander.owner@store.com (Owner of Store 1)');
    console.log('  Password: Owner@Password123');
    console.log('  Email:    nolan.owner@store.com (Owner of Store 2)');
    console.log('  Password: Owner@Password123');
    console.log('\nNormal User Accounts:');
    console.log('  Email:    jonathan.user@gmail.com');
    console.log('  Password: User@Password123');
    console.log('  Email:    benjamin.user@gmail.com');
    console.log('  Password: User@Password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
