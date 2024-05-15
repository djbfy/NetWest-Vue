<template>
  <div class="background">
    <canvas ref="el" width="1200" height="1000"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const el = ref<HTMLCanvasElement>();
const ctx = computed(() => el.value!.getContext("2d")!);

interface Point {
  x: number;
  y: number;
}

interface Branch {
  start: Point;
  length: number;
  theta: number;
}

function init(a: number, b: number, c: number) {
  ctx.value.lineWidth = 0.3;
  ctx.value.strokeStyle = "gray";
  step({
    start: { x: 0, y: a },
    length: 4,
    theta: Math.PI / 6,
  });
  step({
    start: { x: 1200, y: b },
    length: 4,
    theta: Math.PI,
  });
  step({
    start: { x: c, y: 0 },
    length: 4,
    theta: Math.PI / 4,
  });
}
let stepCount = 0;
let pendingTasks: Function[] = [];

function step(b: Branch, depth = 0) {
  const end = getEndPoint(b);
  drawBranch(b);
  stepCount++; 
  if (stepCount >= 7000) return; // 判断生成步骤是否超过1000，超过则停止生成
  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() =>
      step(
        {
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta - 0.3 * Math.random(),
        },
        depth + 1
      )
    );
  }
  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() =>
      step(
        {
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta + 0.3 * Math.random(),
        },
        depth + 1
      )
    );
  }
}

function frame() {
  const tasks: Function[] = [];
  pendingTasks = pendingTasks.filter((i) => {
    if (Math.random() > 0.4) {
      tasks.push(i);
      return false;
    }
    return true;
  });
  tasks.forEach((fn) => fn());
}

let framesCount = 0;
function startFrame() {
  requestAnimationFrame(() => {
    framesCount += 1;
    if (framesCount % 3 === 0) frame();
    startFrame();
  });
}

startFrame();

function lineTo(p1: Point, p2: Point) {
  ctx.value.beginPath();
  ctx.value.moveTo(p1.x, p1.y);
  ctx.value.lineTo(p2.x, p2.y);
  ctx.value.stroke();
}

function getEndPoint(b: Branch): Point {
  return {
    x: b.start.x + b.length * Math.cos(b.theta),
    y: b.start.y + b.length * Math.sin(b.theta),
  };
}

function drawBranch(b: Branch) {
  lineTo(b.start, getEndPoint(b));
}
onMounted(() => {
  const a = Math.floor(Math.random() * (1000 - 100)) + 100;
  const b = Math.floor(Math.random() * (1000 - 100)) + 100;
  const c = Math.floor(Math.random() * (700 - 300 + 1)) + 300;
  init(a, b, c);
});
</script>

<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 确保背景在最顶层 */
}
canvas {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}
</style>
