import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ActionSheetController } from '@ionic/angular';
import { TodoService } from '../services/todo';
import { Task, Category } from '../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  newTaskTitle = '';
  selectedCategoryId = '1';
  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];
  currentFilter = 'all';

  constructor(
    public todoService: TodoService, 
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.todoService.tasks$.subscribe(res => {
      this.tasks = res;
      this.applyFilter();
    });
    this.todoService.categories$.subscribe(res => this.categories = res);
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: this.newTaskTitle,
      completed: false,
      categoryId: this.selectedCategoryId
    };
    this.todoService.addTask(newTask);
    this.newTaskTitle = '';
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;
    await this.todoService.saveTasks(this.tasks);
  }

  async deleteTask(id: string) {
    await this.todoService.deleteTask(id);
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(t => t.categoryId === this.currentFilter);
    }
  }

  filter(event: any) {
    this.currentFilter = event.detail.value;
    this.applyFilter();
  }

  getCategoryName(id: string) {
    return this.categories.find(c => c.id === id)?.name || 'General';
  }

  // GESTIÓN DE CATEGORÍAS (CREAR, EDITAR, ELIMINAR)
  async openCategoryManager() {
    const buttons = this.categories.map(cat => ({
      text: cat.name,
      handler: () => this.editOrDeleteCategory(cat)
    }));

    buttons.push({
      text: ' + Crear Nueva Categoría',
      handler: () => { this.showCategoryForm(); return true; }
    } as any);

    const action = await this.actionSheetCtrl.create({
      header: 'Gestionar Categorías',
      buttons: [...buttons, { text: 'Cancelar', role: 'cancel' }]
    });
    await action.present();
  }

  async showCategoryForm(existingCat?: Category) {
    const alert = await this.alertCtrl.create({
      header: existingCat ? 'Editar Categoría' : 'Nueva Categoría',
      inputs: [{ name: 'name', type: 'text', value: existingCat?.name, placeholder: 'Nombre' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (existingCat) {
              existingCat.name = data.name;
              this.todoService.saveCategories(this.categories);
            } else {
              this.todoService.addCategory(data.name, 'primary');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editOrDeleteCategory(cat: Category) {
    const alert = await this.alertCtrl.create({
      header: cat.name,
      message: '¿Qué deseas hacer?',
      buttons: [
        { text: 'Eliminar', role: 'destructive', handler: () => this.todoService.deleteCategory(cat.id) },
        { text: 'Editar Nombre', handler: () => this.showCategoryForm(cat) },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await alert.present();
  }
}