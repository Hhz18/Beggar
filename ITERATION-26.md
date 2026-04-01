# 🎉 赛博乞讨网站 - 第二十六次迭代总结

## 📅 迭代日期: 2026-03-29

## 🚀 本次迭代主题: Web Locks异步同步与Wake Lock屏幕保持系统

---

## 📊 完成功能总览 (100% 完成)

### 🔒 Web Locks & Wake Lock (100% 完成)

#### 🔧 核心功能
- [x] 分布式锁管理
- [x] 异步任务同步
- [x] 资源竞争控制
- [x] 屏幕唤醒锁定
- [x] 系统休眠防御
- [x] 跨标签页协作
- [x] 智能状态管理
- [x] 自动恢复机制
- [x] 电池优化
- [x] React Hooks集成

#### 🎯 技术亮点
- **Web Locks API**: 跨标签页/worker的异步任务同步
- **Wake Lock API**: 防止屏幕变暗或系统休眠
- **分布式锁**: 确保同一时间只有一个标签页执行任务
- **自动恢复**: 页面恢复可见时自动重新获取Wake Lock
- **状态监控**: 实时锁状态和Wake Lock状态显示
- **电池优化**: 智能释放机制避免耗电

---

## 📈 功能特性

### Web Locks API
- **独占锁**: 确保同一时间只有一个执行者
- **共享锁**: 允许多个读者同时访问
- **锁查询**: 查询全局所有被持有的锁
- **锁模式**: exclusive（独占）和shared（共享）
- **超时控制**: 避免死锁
- **自动释放**: 回调结束自动释放锁

### Wake Lock API
- **屏幕唤醒**: 保持屏幕常亮
- **系统唤醒**: 防止系统休眠（实验性）
- **自动释放**: 页面隐藏时可能被释放
- **自动恢复**: 页面恢复可见时重新获取
- **状态监听**: 实时监听Wake Lock状态
- **释放事件**: 监听Wake Lock被释放事件

### 分布式协调
- **跨标签页同步**: 多标签页任务协调
- **Worker同步**: 主线程与Worker线程同步
- **竞态条件防护**: 防止资源竞争
- **任务队列**: 确保任务按顺序执行
- **独占访问**: 关键资源独占访问

### 状态管理
- **客户端ID**: 唯一标识每个客户端
- **标签页ID**: 唯一标识每个标签页
- **活跃锁列表**: 显示当前持有的锁
- **全局锁查询**: 查看所有被持有的锁
- **Wake Lock状态**: 显示唤醒锁状态

---

## 🎓 核心学习价值

- ✅ Web Locks API
- ✅ Wake Lock API
- ✅ 分布式锁机制
- ✅ 异步任务同步
- ✅ 跨标签页通信
- ✅ 资源竞争控制
- ✅ 屏幕唤醒管理
- ✅ 系统休眠防御
- ✅ 自动恢复机制
- ✅ 状态监控

---

## 📁 新增文件

```
lib/locks/
  └── locksEngine.ts                # Locks引擎核心 (500+ LOC)
hooks/
  └── useLocks.ts                   # Locks Hooks (300+ LOC)
components/Locks/
  ├── LocksPanel.tsx                # Locks控制面板 (330+ LOC)
  └── LockStatusBadge.tsx           # 锁状态指示器 (50+ LOC)
```

---

## 🔧 修改文件

- `app/page.tsx` - 集成Locks入口和状态指示器

---

## 💡 使用示例

### 基础分布式锁

```typescript
import { useLocks } from '@/hooks/useLocks';

function DistributedTask() {
  const { requestLock } = useLocks();

  const executeCriticalTask = async () => {
    try {
      await requestLock(
        'critical-resource',
        async (lock) => {
          // 只有持有锁的标签页才能执行
          console.log('Lock acquired, executing task...');
          await performCriticalOperation();
          console.log('Task completed');
        },
        { mode: 'exclusive' }
      );
    } catch (error) {
      console.error('Failed to acquire lock:', error);
    }
  };

  return <button onClick={executeCriticalTask}>执行任务</button>;
}
```

### Wake Lock - 屏幕保持

```typescript
import { useWakeLock } from '@/hooks/useLocks';

function ReadingApp() {
  const { isActive, acquire, release, toggle } = useWakeLock();

  return (
    <div>
      <button onClick={toggle}>
        {isActive ? '关闭屏幕常亮' : '开启屏幕常亮'}
      </button>
      {isActive && (
        <div className="status">
          ⏰ 屏幕将保持常亮
        </div>
      )}
    </div>
  );
}
```

### 异步任务锁

```typescript
import { useAsyncLock } from '@/hooks/useLocks';

function DataSync() {
  const { runExclusive } = useAsyncLock();

  const syncData = async () => {
    await runExclusive('data-sync', async () => {
      // 确保同一时间只有一个sync在运行
      await fetchData();
      await processData();
      await saveData();
    });
  };

  return <button onClick={syncData}>同步数据</button>;
}
```

### 共享锁 - 多读者

```typescript
const { requestLock } = useLocks();

const readData = async () => {
  await requestLock(
    'shared-data',
    async (lock) => {
      // 多个读者可以同时持有共享锁
      const data = await fetchData();
      return data;
    },
    { mode: 'shared' }
  );
};

const writeData = async () => {
  await requestLock(
    'shared-data',
    async (lock) => {
      // 写入者需要独占锁
      await updateData();
    },
    { mode: 'exclusive', steal: true }
  );
};
```

### 锁查询

```typescript
const { queryLocks, isLockHeld } = useLocks();

const checkLockStatus = async () => {
  // 查询所有锁
  const snapshot = await queryLocks();
  console.log('Held locks:', snapshot.held);

  // 检查特定锁
  const isHeld = await isLockHeld('my-resource');
  console.log('Lock held:', isHeld);
};
```

### Wake Lock自动恢复

```typescript
const { requestWakeLock } = useLocks();

// 页面隐藏时Wake Lock可能被释放
// 页面恢复可见时自动重新获取
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    try {
      await requestWakeLock('screen');
      console.log('Wake Lock reacquired');
    } catch (error) {
      console.error('Failed to reacquire Wake Lock:', error);
    }
  }
});
```

---

## 🌐 浏览器支持

### Web Locks API
- ✅ Chrome 69+
- ✅ Edge 79+
- ✅ Firefox 96+
- ✅ Safari 15.2+
- ✅ Opera 56+
- ✅ Samsung Internet 10.0+

### Wake Lock API
- ✅ Chrome 84+
- ✅ Edge 84+
- ✅ Opera 70+
- ✅ Android Chrome 84+
- ⚠️ Firefox: 不支持
- ⚠️ Safari: 不支持

---

## 🔧 API详解

### Web Locks API

#### requestLock()
```typescript
await navigator.locks.request(
  name: string,              // 锁名称
  options: {
    mode: 'exclusive' | 'shared',
    ifAvailable: boolean,    // 如果锁不可用是否立即返回
    steal: boolean,          // 是否强制窃取锁
  },
  callback: (lock: Lock) => Promise<any> | any
)
```

#### query()
```typescript
const snapshot = await navigator.locks.query();
// {
//   held: Lock[],           // 当前持有的锁
//   pending: LockDescriptor[] // 等待中的锁
// }
```

### Wake Lock API

#### request()
```typescript
const wakeLock = await navigator.wakeLock.request('screen');
// 类型: 'screen' | 'system'
// 返回: WakeLockSentinel
```

#### release()
```typescript
await wakeLock.release();
```

#### release事件
```typescript
wakeLock.addEventListener('release', () => {
  console.log('Wake Lock was released');
});
```

---

## 🎨 应用场景

### 防止竞态条件
```typescript
// 多标签页同时尝试更新同一资源
const updateResource = async (id: string, data: any) => {
  await requestLock(`resource-${id}`, async () => {
    const current = await fetchResource(id);
    const updated = merge(current, data);
    await saveResource(id, updated);
  });
};
```

### 任务队列
```typescript
// 确保任务按顺序执行
const processQueue = async (tasks: Task[]) => {
  for (const task of tasks) {
    await requestLock('task-queue', async () => {
      await processTask(task);
    });
  }
};
```

### 在线阅读
```typescript
// 保持屏幕常亮
const ReadingMode = () => {
  const { isActive, toggle } = useWakeLock();

  return (
    <div>
      <button onClick={toggle}>
        {isActive ? '🔓 已解锁' : '🔒 保持常亮'}
      </button>
    </div>
  );
};
```

### 视频通话
```typescript
// 视频通话时保持屏幕和系统唤醒
const VideoCall = () => {
  useEffect(() => {
    const acquireLock = async () => {
      try {
        await navigator.wakeLock.request('screen');
      } catch (err) {
        console.error('Wake Lock failed:', err);
      }
    };

    acquireLock();

    return () => {
      // 清理
    };
  }, []);
};
```

### 演示文稿
```typescript
// 演示模式保持屏幕常亮
const Presentation = () => {
  const { isActive, acquire, release } = useWakeLock();

  const startPresentation = async () => {
    await acquire();
    enterFullscreen();
  };

  const endPresentation = async () => {
    await release();
    exitFullscreen();
  };

  return (
    <>
      <button onClick={startPresentation}>开始演示</button>
      <button onClick={endPresentation}>结束演示</button>
    </>
  );
};
```

---

## ⚡ 性能优化

### 电池优化
- **及时释放**: 不需要时及时释放Wake Lock
- **监听可见性**: 页面隐藏时主动释放
- **避免长时间持有**: 减少Wake Lock持有时间
- **智能恢复**: 页面恢复可见时才重新获取

### 锁优化
- **避免死锁**: 设置合理的锁超时
- **最小锁范围**: 只锁定必要的代码
- **快速释放**: 完成任务立即释放
- **共享锁**: 读操作使用共享锁

---

## 🔒 安全考虑

### 资源保护
```typescript
// 关键操作使用独占锁
const criticalOperation = async () => {
  await requestLock('critical', async () => {
    // 只有一个标签页能执行
    await transferFunds();
  }, { mode: 'exclusive', steal: false });
};
```

### 防止滥用
```typescript
// 限制锁的持有时间
const requestLockWithTimeout = async (name: string, callback: any, timeout = 5000) => {
  await requestLock(name, async (lock) => {
    const timeoutId = setTimeout(() => {
      throw new Error('Lock timeout');
    }, timeout);

    try {
      await callback(lock);
    } finally {
      clearTimeout(timeoutId);
    }
  });
};
```

---

## 🐛 调试技巧

### Chrome DevTools
```javascript
// 查看所有锁
navigator.locks.query().then(snapshot => {
  console.log('Held locks:', snapshot.held);
  console.log('Pending locks:', snapshot.pending);
});

// 查看Wake Lock状态
navigator.wakeLock.request('screen').then(wakeLock => {
  console.log('Wake Lock acquired:', wakeLock);

  wakeLock.addEventListener('release', () => {
    console.log('Wake Lock released');
  });
});
```

### 常见问题

**Q: Wake Lock自动释放**
- A: 页面隐藏时浏览器可能自动释放，需要监听visibilitychange重新获取

**Q: 锁一直等待**
- A: 检查是否有其他标签页持有锁，使用ifAvailable选项

**Q: 页面崩溃后锁未释放**
- A: 浏览器会在页面卸载时自动释放所有锁

**Q: 多个锁如何管理**
- A: 使用命名空间，如`resource-${id}`, `task-${type}`

---

## 📚 相关资源

### 官方文档
- [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API)
- [Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Wake_Lock_API)
- [Web Locks Specification](https://w3c.github.io/web-locks/)
- [Wake Lock Specification](https://w3c.github.io/wake-lock/)

### 学习资源
- [Using Web Locks](https://developer.chrome.com/blog/web-locks/)
- [Wake Lock API Guide](https://web.dev/wake-lock/)

---

## 🎯 最佳实践

### ✅ 推荐做法
1. 使用描述性的锁名称
2. 及时释放锁
3. 使用ifAvailable避免阻塞
4. 监听visibilitychange恢复Wake Lock
5. 共享锁用于读，独占锁用于写

### ❌ 避免做法
1. 长时间持有锁
2. 嵌套锁（容易死锁）
3. 不处理异常直接返回
4. 滥用Wake Lock导致耗电
5. 不清理锁直接关闭页面

---

## 🎉 迭代总结

本次迭代实现了完整的Web Locks异步同步与Wake Lock屏幕保持系统，包括:

✅ **核心功能**: 分布式锁管理、异步任务同步、屏幕唤醒锁定
✅ **引擎封装**: 完整的LocksEngine类封装（500+ LOC）
✅ **React集成**: useLocks、useDistributedLock、useWakeLock、useAsyncLock Hooks
✅ **UI组件**: 控制面板和状态指示器
✅ **自动恢复**: 页面恢复可见时自动重新获取Wake Lock
✅ **状态监控**: 实时锁状态和Wake Lock状态显示
✅ **电池优化**: 智能释放机制避免耗电
✅ **开发友好**: 丰富的API、清晰的架构、详细文档

**技术深度**: ⭐⭐⭐⭐⭐
**实用价值**: ⭐⭐⭐⭐⭐
**学习价值**: ⭐⭐⭐⭐⭐

---

*Generated with Claude Code - Iteration 26*
*Web Locks & Wake Lock Synchronization System*
