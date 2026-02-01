import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task, Category } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';
import { RemoteConfig, fetchAndActivate, getBoolean } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _storage: Storage | null = null;
  private _tasks = new BehaviorSubject<Task[]>([]);
  private _categories = new BehaviorSubject<Category[]>([]);

  tasks$ = this._tasks.asObservable();
  categories$ = this._categories.asObservable();
  public canDelete = true;

  constructor(private storage: Storage, private remoteConfig: RemoteConfig) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.checkFeatureFlags();
    this.loadData();
  }

  async checkFeatureFlags() {
    try {
      await fetchAndActivate(this.remoteConfig);
      this.canDelete = getBoolean(this.remoteConfig, 'task_delete_enabled');
    } catch (err) {
      this.canDelete = true;
    }
  }

  async loadData() {
    const storedTasks = await this._storage?.get('tasks') || [];
    const storedCats = await this._storage?.get('categories') || [{ id: '1', name: 'General', color: 'primary' }];
    this._tasks.next(storedTasks);
    this._categories.next(storedCats);
  }

  // TAREAS
  async saveTasks(tasks: Task[]) {
    this._tasks.next(tasks);
    await this._storage?.set('tasks', tasks);
  }

  async addTask(task: Task) {
    const newTasks = [...this._tasks.value, task];
    await this.saveTasks(newTasks);
  }

  async deleteTask(id: string) {
    const newTasks = this._tasks.value.filter(t => t.id !== id);
    await this.saveTasks(newTasks);
  }

  // CATEGORÍAS
  async saveCategories(cats: Category[]) {
    this._categories.next(cats);
    await this._storage?.set('categories', cats);
  }

  async addCategory(name: string, color: string) {
    const newCat = { id: Date.now().toString(), name, color };
    await this.saveCategories([...this._categories.value, newCat]);
  }

  async deleteCategory(id: string) {
    if (id === '1') return; // No borrar la general
    const newCats = this._categories.value.filter(c => c.id !== id);
    await this.saveCategories(newCats);
    const updatedTasks = this._tasks.value.map(t => t.categoryId === id ? {...t, categoryId: '1'} : t);
    await this.saveTasks(updatedTasks);
  }
}