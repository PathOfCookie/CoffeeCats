// packages/host/src/declarations.d.ts
declare module 'mf_auth/AuthPage' {
  import { ComponentType } from 'react';
  
  interface AuthPageProps {
    onLogin: (user: any, token: string) => void;
  }
  
  const AuthPage: ComponentType<AuthPageProps>;
  export default AuthPage;
}

declare module 'mf_products/ProductsTable' {
  import { ComponentType } from 'react';
  import { User } from '@coffee-cats/shared';
  
  interface ProductsTableProps {
    user: User | null;
  }
  
  const ProductsTable: ComponentType<ProductsTableProps>;
  export default ProductsTable;
}

declare module 'mf_cats/CatsTable' {
  import { ComponentType } from 'react';
  import { User } from '@coffee-cats/shared';
  
  interface CatsTableProps {
    user: User | null;
  }
  
  const CatsTable: ComponentType<CatsTableProps>;
  export default CatsTable;
}