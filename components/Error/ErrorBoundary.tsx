"use client";

import { Component, ReactNode, memo } from 'react';
import { logComponentError } from '@/lib/errorHandling';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary组件
 * 捕获子组件的错误并显示友好的错误信息
 */
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to centralized error handling system
    logComponentError(error, errorInfo.componentStack);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 使用自定义fallback或默认错误UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#ebf1d6] flex items-center justify-center p-4">
          <div className="bg-[#d0d3b2] pixel-border max-w-md w-full p-6 text-center">
            {/* 错误图标 */}
            <div className="text-6xl mb-4">😱</div>

            {/* 标题 */}
            <h2 className="text-2xl text-[#3d3d3d] mb-4 font-pixel">
              哎呀，出错了！
            </h2>

            {/* 错误信息 */}
            <div className="bg-[#ebf1d6] pixel-border p-4 mb-4">
              <p className="text-sm text-[#5a5a5a] mb-2">
                {this.state.error?.message || '发生了未知错误'}
              </p>
              <p className="text-xs text-[#5a5a5a]">
                请刷新页面重试
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="pixel-button bg-[#a8cda2] px-6 py-3 text-sm text-[#3d3d3d] hover:bg-[#ebf1d6]"
              >
                重试
              </button>
              <button
                onClick={() => window.location.reload()}
                className="pixel-button bg-[#d0d3b2] px-6 py-3 text-sm text-[#3d3d3d] hover:bg-[#a8cda2]"
              >
                刷新页面
              </button>
            </div>

            {/* 底部信息 */}
            <p className="text-xs text-[#5a5a5a] mt-4">
              ( =^･ω･^= ) 技术喵正在修复中...
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * ErrorBoundary组件的memo包装
 */
function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundaryClass>
  );
}

export default memo(ErrorBoundary);
