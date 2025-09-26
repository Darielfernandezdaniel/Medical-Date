import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

  private storedHandles = new Map<string, DetachedRouteHandle>();

  // Indica si se debe guardar esta ruta
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Puedes filtrar solo la ruta de tu componente
    return route.routeConfig?.path === 'our-technologi';
  }

  // Guarda la instancia del componente
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      const key = route.routeConfig?.path!;
      this.storedHandles.set(key, handle);
    }
  }

  // Indica si hay una instancia guardada que se puede reutilizar
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = route.routeConfig?.path!;
    return this.storedHandles.has(key);
  }

  // Devuelve la instancia guardada
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = route.routeConfig?.path!;
    return this.storedHandles.get(key) || null;
  }

  // Indica si se debe volver a crear el componente
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
