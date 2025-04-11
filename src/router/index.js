import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/index.vue'
import EditorView from '../views/editor/index.vue'
import TemplatesView from '../views/templates/index.vue'
import InterviewView from '../views/interview/index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editor',
    name: 'editor',
    component: EditorView
  },
  {
    path: '/templates',
    name: 'templates',
    component: TemplatesView
  },
  {
    path: '/interview',
    name: 'interview',
    component: InterviewView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
