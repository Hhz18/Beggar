# JSDoc 文档指南

本文档定义了 Cyber Beggar 项目的 JSDoc 注释规范和最佳实践。

## 目录

- [函数文档模板](#函数文档模板)
- [组件文档模板](#组件文档模板)
- [类型文档模板](#类型文档模板)
- [常量文档模板](#常量文档模板)
- [最佳实践](#最佳实践)
- [示例](#示例)

---

## 函数文档模板

### 基本函数

```typescript
/**
 * 函数的简短描述（一句话说明）
 *
 * 更详细的描述（可选，解释函数的用途、行为等）
 *
 * @param {Type} paramName - 参数描述
 * @returns {Type} 返回值描述
 * @throws {ErrorType} 何时抛出错误（可选）
 *
 * @example
 * ```typescript
 * const result = functionName(arg1, arg2);
 * console.log(result);
 * ```
 */
export function functionName(paramName: Type): ReturnType {
  // 实现
}
```

### 异步函数

```typescript
/**
 * 异步函数的简短描述
 *
 * @param {string} id - 要获取的资源ID
 * @returns {Promise<Data>} 返回数据的 Promise
 * @throws {Error} 当资源不存在时抛出错误
 *
 * @example
 * ```typescript
 * const data = await fetchData('abc123');
 * console.log(data);
 * ```
 */
export async function fetchData(id: string): Promise<Data> {
  // 实现
}
```

### 回调函数

```typescript
/**
 * 注册事件监听器
 *
 * @param {string} event - 事件名称
 * @param {(data: any) => void} callback - 事件回调函数
 * @returns {() => void} 取消监听的函数
 *
 * @example
 * ```typescript
 * const unsubscribe = onMessage('data', (data) => {
 *   console.log('Received:', data);
 * });
 * // later
 * unsubscribe();
 * ```
 */
export function onMessage(event: string, callback: (data: any) => void): () => void {
  // 实现
}
```

---

## 组件文档模板

### React 组件

```typescript
/**
 * ComponentName - 组件简短描述
 *
 * @description
 * 组件的详细描述和使用说明。
 * 可以多行，解释组件的用途、行为和特殊考虑。
 *
 * @param {PropsType} props - 组件属性
 * @returns {JSX.Element} 渲染的组件
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={123}
 *   onAction={() => console.log('action')}
 * />
 * ```
 */
export function ComponentName(props: PropsType): JSX.Element {
  // 实现
}
```

### 带泛型的组件

```typescript
/**
 * GenericList - 通用列表组件
 *
 * @description
 * 渲染任意类型项目的列表。支持自定义渲染和空状态。
 *
 * @typeParam T - 列表项的类型
 * @param {GenericListProps<T>} props - 组件属性
 * @returns {JSX.Element} 渲染的列表组件
 *
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * <GenericList<User>
 *   items={users}
 *   keyExtractor={(user) => user.id}
 *   renderItem={(user) => <div>{user.name}</div>}
 * />
 * ```
 */
export function GenericList<T>(props: GenericListProps<T>): JSX.Element {
  // 实现
}
```

---

## 类型文档模板

### 接口

```typescript
/**
 * 接口简短描述
 *
 * @description
 * 更详细的接口描述（可选）
 *
 * @property {string} id - 唯一标识符
 * @property {number} count - 计数
 * @property {boolean} active - 是否激活
 *
 * @example
 * ```typescript
 * const instance: MyInterface = {
 *   id: 'abc123',
 *   count: 42,
 *   active: true,
 * };
 * ```
 */
export interface MyInterface {
  /** 唯一标识符 */
  id: string;
  /** 计数 */
  count: number;
  /** 是否激活 */
  active: boolean;
}
```

### 类型别名

```typescript
/**
 * 支付方式类型
 * @type {('wechat' | 'alipay')}
 *
 * @example
 * ```typescript
 * const method: PaymentMethod = 'wechat';
 * ```
 */
export type PaymentMethod = 'wechat' | 'alipay';
```

### 枚举

```typescript
/**
 * 用户状态枚举
 *
 * @description
 * 表示用户在系统中的当前状态
 *
 * @example
 * ```typescript
 * const status: UserStatus = UserStatus.Active;
 * ```
 */
export enum UserStatus {
  /** 活跃用户 */
  Active = 'active',
  /** 未激活 */
  Inactive = 'inactive',
  /** 已暂停 */
  Suspended = 'suspended',
}
```

---

## 常量文档模板

### 对象常量

```typescript
/**
 * 应用配置常量
 *
 * @description
 * 包含应用级别的配置选项
 *
 * @example
 * ```typescript
 * const timeout = APP_CONFIG.timeout;
 * console.log(`Timeout: ${timeout}ms`);
 * ```
 */
export const APP_CONFIG = {
  /** 请求超时时间（毫秒） */
  timeout: 5000,
  /** 最大重试次数 */
  maxRetries: 3,
  /** 是否启用调试模式 */
  debug: false,
} as const;
```

### 数组常量

```typescript
/**
 * 默认感谢语录
 *
 * @description
 * 当用户收到捐赠时显示的默认语录
 *
 * @example
 * ```typescript
 * const randomQuote = DEFAULT_QUOTES[Math.floor(Math.random() * DEFAULT_QUOTES.length)];
 * ```
 */
export const DEFAULT_QUOTES: Quote[] = [
  {
    text: 'Thank you for your generosity!',
    category: 'touching',
  },
  {
    text: 'You made my day!',
    category: 'funny',
  },
];
```

---

## 最佳实践

### 1. 保持简洁但完整

```typescript
// ✅ 好的
/**
 * 获取指定ID的捐赠记录
 *
 * @param {string} id - 捐赠记录ID
 * @returns {DonationRecord | null} 捐赠记录，不存在时返回 null
 */
export function getDonationById(id: string): DonationRecord | null {
  // 实现
}

// ❌ 不好的 - 太冗长
/**
 * This function serves as a retrieval mechanism for donation records.
 * It accepts a string parameter which represents the unique identifier
 * of the donation record that the user wishes to retrieve from the
 * storage system. Upon successful retrieval, the function returns the
 * complete donation record object. In the event that no record with the
 * specified identifier exists within the storage system, the function
 * will return a null value to indicate the absence of such a record.
 */
```

### 2. 使用 @description 进行多行描述

```typescript
/**
 * 复杂函数的简短描述
 *
 * @description
 * 这里可以有更详细的描述，解释：
 * - 函数的复杂逻辑
 * - 特殊行为或副作用
 * - 性能考虑
 * - 使用注意事项
 *
 * @param {Type} param - 参数描述
 * @returns {Type} 返回值描述
 */
```

### 3. 提供有意义的示例

```typescript
// ✅ 好的 - 实用的示例
/**
 * 计算捐赠统计
 *
 * @param {DonationRecord[]} donations - 捐赠记录数组
 * @returns {DonationStats} 统计结果
 *
 * @example
 * ```typescript
 * const donations = [
 *   { id: '1', amount: 100, paymentMethod: 'wechat', timestamp: Date.now(), date: '2026-04-01' },
 *   { id: '2', amount: 50, paymentMethod: 'alipay', timestamp: Date.now(), date: '2026-04-01' },
 * ];
 * const stats = calculateDonationStats(donations);
 * console.log(`Total: ${stats.totalAmount}`); // Total: 150
 * ```
 */
```

### 4. 记录抛出的错误

```typescript
/**
 * 保存捐赠记录
 *
 * @param {Omit<DonationRecord, 'id' | 'timestamp' | 'date'>} data - 捐赠数据
 * @returns {DonationRecord} 完整的捐赠记录（包含生成的ID和时间戳）
 * @throws {Error} 当存储空间不足时抛出错误
 * @throws {ValidationError} 当数据验证失败时抛出错误
 */
export function saveDonation(data: Omit<DonationRecord, 'id' | 'timestamp' | 'date'>): DonationRecord {
  // 实现
}
```

### 5. 使用 @typeParam 记录泛型

```typescript
/**
 * 通用存储管理器
 *
 * @typeParam T - 存储的数据类型
 *
 * @example
 * ```typescript
 * const stringStorage = new StorageManager<string>({
 *   key: 'my-string',
 *   defaultValue: 'hello',
 * });
 *
 * const numberStorage = new StorageManager<number>({
 *   key: 'my-number',
 *   defaultValue: 42,
 * });
 * ```
 */
export class StorageManager<T> {
  // 实现
}
```

### 6. 记录可选项和默认值

```typescript
/**
 * 格式化日期
 *
 * @param {Date} date - 要格式化的日期
 * @param {Locale} locale - 区域设置（默认：'zh-CN'）
 * @param {string} format - 格式模式（默认：'YYYY-MM-DD'）
 * @returns {string} 格式化后的日期字符串
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date(), 'en-US', 'MM/DD/YYYY');
 * console.log(formatted); // "04/01/2026"
 * ```
 */
export function formatDate(
  date: Date,
  locale: Locale = 'zh-CN',
  format: string = 'YYYY-MM-DD'
): string {
  // 实现
}
```

---

## 示例

### 完整的模块示例

```typescript
/**
 * 捐赠管理模块
 * @module lib/donation
 */

import { DonationRecord, DonationStats, PaymentMethod } from '@/types';

/**
 * 保存新的捐赠记录
 *
 * @param {Omit<DonationRecord, 'id' | 'timestamp' | 'date'>} data - 捐赠数据
 * @returns {DonationRecord} 完整的捐赠记录
 * @throws {Error} 当保存失败时抛出错误
 *
 * @example
 * ```typescript
 * const donation = saveDonation({
 *   amount: 100,
 *   paymentMethod: 'wechat',
 * });
 * console.log(`Saved with ID: ${donation.id}`);
 * ```
 */
export function saveDonation(
  data: Omit<DonationRecord, 'id' | 'timestamp' | 'date'>
): DonationRecord {
  // 实现
}

/**
 * 获取所有捐赠记录
 *
 * @returns {DonationRecord[]} 捐赠记录数组，按时间戳降序排列
 *
 * @example
 * ```typescript
 * const donations = getDonations();
 * console.log(`Total donations: ${donations.length}`);
 * ```
 */
export function getDonations(): DonationRecord[] {
  // 实现
}

/**
 * 计算捐赠统计信息
 *
 * @param {DonationRecord[]} donations - 捐赠记录数组
 * @returns {DonationStats} 统计信息
 *
 * @example
 * ```typescript
 * const donations = getDonations();
 * const stats = calculateDonationStats(donations);
 * console.log(`Total amount: ${stats.totalAmount}`);
 * ```
 */
export function calculateDonationStats(donations: DonationRecord[]): DonationStats {
  // 实现
}
```

---

## 工具支持

### VS Code

安装以下扩展以获得更好的 JSDoc 支持：

- **TypeScript Importer** - 自动导入类型
- **Document This** - 自动生成 JSDoc 注释
- **TypeScript DocBlock** - 增强 JSDoc 高亮

### TypeScript 编译器

确保 `tsconfig.json` 包含以下配置：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## 检查清单

在提交代码前，确保：

- [ ] 所有导出的函数都有 JSDoc 注释
- [ ] 所有导出的组件都有 `@description` 和 `@example`
- [ ] 所有类型和接口都有文档
- [ ] 所有复杂逻辑都有解释
- [ ] 所有示例都是可运行的代码
- [ ] 所有 `@param` 和 `@returns` 类型正确
- [ ] 所有抛出的错误都有文档

---

**最后更新**: 2026-04-01
**维护者**: Cyber Beggar Team
