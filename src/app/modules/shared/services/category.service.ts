import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api/v1';
//const base_url = 'https://springboot-app-438518.rj.r.appspot.com/api/v1';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories() {
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);
  }

  saveCategories(body: any) {
    const endpoint = `${base_url}/categories`;
    return this.http.post(endpoint, body);
  }

  updateCategory(id: any, body: any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.put(endpoint, body);
  }

  deleteCategory(id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.delete(endpoint);
  }

  getCategoryById(id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.get(endpoint);
  }

  getCategoryByName(name: string) {
    const endpoint = `${base_url}/categories/filter/${name}`;
    return this.http.get(endpoint);
  }

  exportCategories() {
    const endpoint = `${base_url}/categories/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob',
    });
  }
}
