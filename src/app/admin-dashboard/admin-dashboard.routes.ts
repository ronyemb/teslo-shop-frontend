import { Routes } from "@angular/router";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { AdminDashboardLayoutComponent } from "./layouts/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { isAdminGuard } from "@/auth/guards/is-admin.guard";

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [
      isAdminGuard,
    ],
    children: [
      {
        path: 'products',
        component: ProductsAdminPageComponent
      },
      {
        path: 'products/:id',
        component: ProductAdminPageComponent
      },
      {
        path: '**',
        redirectTo: 'products'
      },
    ]
  }
];

export default adminDashboardRoutes;
