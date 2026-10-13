import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ChartErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[CHART FAILED] Title: ${this.props.title}, Error: ${error.message}, Stack: ${error.stack ?? errorInfo.componentStack}`,
    );
  }

  componentDidUpdate(previousProps: Props) {
    if (previousProps.title !== this.props.title && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-amber-700">
          <span className="font-semibold">⚠️ No se pudo cargar: {this.props.title}</span>
          <span className="text-amber-600">
            Este gráfico no está disponible temporalmente
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}
