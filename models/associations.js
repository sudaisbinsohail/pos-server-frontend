
module.exports = (db) => {
  const {
    Brand,
    Category,
    Company,
    Customer,
    Product,
    ProductUnit,
    Sale,
    SaleItem,
    Supplier,
    Unit,
    User,
    Role,
    Permission,
    RolePermission
  } = db;
  
  // -----------------------------
  // Company & User
  // -----------------------------
  Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });
  User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

  // -----------------------------
  // User & Brand
  // -----------------------------
  User.hasMany(Brand, { foreignKey: 'user_id', as: 'brands' });
  Brand.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // -----------------------------
  // User & Category
  // -----------------------------
  User.hasMany(Category, { foreignKey: 'user_id', as: 'categories' });
  Category.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // -----------------------------
  // User & Product
  // -----------------------------
  User.hasMany(Product, { foreignKey: 'user_id', as: 'products' });
  Product.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // -----------------------------
  // User & Supplier
  // -----------------------------
  User.hasMany(Supplier, { foreignKey: 'user_id', as: 'suppliers' });
  Supplier.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // -----------------------------
  // User & Customer
  // -----------------------------
  User.hasMany(Customer, { foreignKey: 'user_id', as: 'customers' });
  Customer.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

  // -----------------------------
  // User & Unit (creator)
  // -----------------------------
  User.hasMany(Unit, { foreignKey: 'user_id', as: 'createdUnits' });
  Unit.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

  // -----------------------------
  // User & Sale (cashier)
  // -----------------------------
  User.hasMany(Sale, { foreignKey: 'user_id', as: 'sales' });
  Sale.belongsTo(User, { foreignKey: 'user_id', as: 'cashier' });

  // -----------------------------
  // Category & Product
  // -----------------------------
  Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
  Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

  // -----------------------------
  // Brand & Product
  // -----------------------------
  Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
  Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

  // -----------------------------
  // Unit & ProductUnit
  // -----------------------------
  Unit.hasMany(ProductUnit, { foreignKey: 'unit_id', as: 'productUnits' });
  ProductUnit.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

  // -----------------------------
  // Product & ProductUnit
  // -----------------------------
  Product.hasMany(ProductUnit, { foreignKey: 'product_id', as: 'units' });
  ProductUnit.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // -----------------------------
  // Unit self-reference (base unit)
  // -----------------------------
  Unit.belongsTo(Unit, { foreignKey: 'base_unit_id', as: 'base_unit' });
  Unit.hasMany(Unit, { foreignKey: 'base_unit_id', as: 'child_units' });

  // -----------------------------
  // ProductUnit & Base Unit
  // -----------------------------
  Unit.hasMany(ProductUnit, { foreignKey: 'base_unit_id', as: 'baseProductUnits' });
  ProductUnit.belongsTo(Unit, { foreignKey: 'base_unit_id', as: 'base_unit' });

  // -----------------------------
  // Category self-reference (parent category)
  // -----------------------------
  Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parentCategory' });
  Category.hasMany(Category, { foreignKey: 'parentId', as: 'subCategories' });

  // -----------------------------
  // Product & Base Unit
  // -----------------------------
  Product.belongsTo(Unit, {
    foreignKey: 'base_unit_id',
    as: 'base_unit',
  });

  // -----------------------------
  // Customer & Sale
  // -----------------------------
  Customer.hasMany(Sale, { foreignKey: 'customer_id', as: 'sales' });
  Sale.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

  // -----------------------------
  // Sale & SaleItem
  // -----------------------------
  Sale.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'items' });
  SaleItem.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });

  // -----------------------------
  // Product & SaleItem
  // -----------------------------
  Product.hasMany(SaleItem, { foreignKey: 'product_id', as: 'saleItems' });
  SaleItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // -----------------------------
  // Unit & SaleItem
  // -----------------------------
  Unit.hasMany(SaleItem, { foreignKey: 'unit_id', as: 'saleItems' });
  SaleItem.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });


    // -----------------------------
  // Role & User
  // -----------------------------
  Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
  User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

  // -----------------------------
  // Role & Permission (Many-to-Many)
  // -----------------------------
  Role.belongsToMany(Permission, {
    through: 'RolePermission',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions'
  });

  Permission.belongsToMany(Role, {
    through: 'RolePermission',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles'
  });


};