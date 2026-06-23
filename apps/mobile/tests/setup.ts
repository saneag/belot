import React from "react";

import { vi } from "vitest";

const UI_ONLY_PROPS = new Set([
  "action",
  "variant",
  "size",
  "space",
  "as",
  "isDisabled",
  "isHovered",
  "isFocusVisible",
  "isFocused",
  "isInvalid",
  "isOpen",
  "isTruncated",
  "bold",
  "underline",
  "strikeThrough",
  "italic",
  "highlight",
  "sub",
  "placement",
  "shouldOverlapWithTrigger",
  "trigger",
  "context",
  "testID",
]);

const DOM_EVENT_PROPS = new Set([
  "onClick",
  "onChange",
  "onInput",
  "onFocus",
  "onBlur",
  "onKeyDown",
  "onKeyUp",
  "onKeyPress",
  "onMouseDown",
  "onMouseUp",
  "onMouseEnter",
  "onMouseLeave",
  "onSubmit",
  "onDoubleClick",
  "onContextMenu",
  "onWheel",
  "onScroll",
]);

function omitUiProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (UI_ONLY_PROPS.has(key) || key.startsWith("accessibility")) {
      continue;
    }

    if (key.startsWith("on") && !DOM_EVENT_PROPS.has(key)) {
      continue;
    }

    domProps[key] = value;
  }

  return domProps;
}

const createElement = (
  tag: string,
  { children, onPress, onLongPress, onChangeText, ...props }: Record<string, unknown> = {},
) => {
  const domProps = omitUiProps(props);

  if (onPress || onLongPress || domProps.onClick) {
    return React.createElement(
      "button",
      {
        type: "button",
        onClick: onPress ?? domProps.onClick,
        onDoubleClick: onLongPress,
        ...domProps,
      },
      children as React.ReactNode,
    );
  }

  if (typeof onChangeText === "function") {
    return React.createElement("input", {
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChangeText(e.target.value),
      ...domProps,
    });
  }

  return React.createElement(tag, domProps, children as React.ReactNode);
};

interface MockScrollViewHandle {
  scrollToEnd: ReturnType<typeof vi.fn>;
  scrollTo: ReturnType<typeof vi.fn>;
}

const MockScrollView = React.forwardRef<MockScrollViewHandle, Record<string, unknown>>(
  function MockScrollView(props, ref) {
    React.useImperativeHandle(ref, () => ({
      scrollToEnd: vi.fn(),
      scrollTo: vi.fn(),
    }));

    return React.createElement("div", omitUiProps(props));
  },
);

vi.mock("react-native", () => {
  const listeners: Record<string, ((e?: unknown) => void)[]> = {};
  const platform = {
    OS: "ios" as string,
    select: (obj: Record<string, unknown>) => obj.ios ?? obj.default,
  };

  return {
    __listeners: listeners,
    __emit: (event: string, payload?: unknown) => {
      listeners[event]?.forEach((handler) => handler(payload));
    },
    __platform: platform,
    Platform: platform,
    View: (props: Record<string, unknown>) => createElement("div", props),
    Text: (props: Record<string, unknown>) => createElement("span", props),
    Image: (props: Record<string, unknown>) => createElement("img", props),
    ScrollView: MockScrollView,
    TouchableWithoutFeedback: ({ onPress, ...props }: Record<string, unknown>) =>
      createElement("div", { onPress, ...props }),
    Keyboard: {
      dismiss: vi.fn(),
      addListener: vi.fn((event: string, handler: (e?: unknown) => void) => {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(handler);
        return {
          remove: () => {
            listeners[event] = listeners[event].filter((h) => h !== handler);
          },
        };
      }),
    },
    AppState: {
      currentState: "active",
      addEventListener: vi.fn((_event: string, handler: (state: string) => void) => ({
        remove: vi.fn(),
        handler,
      })),
    },
    BackHandler: {
      addEventListener: vi.fn((_event: string, handler: () => boolean) => ({
        remove: vi.fn(),
        handler,
      })),
    },
    useColorScheme: vi.fn(() => "light"),
    useWindowDimensions: vi.fn(() => ({ width: 400, height: 800 })),
    ToastAndroid: {
      showWithGravity: vi.fn(),
      SHORT: 0,
      CENTER: 1,
    },
    ActivityIndicator: (props: Record<string, unknown>) => createElement("div", props),
    Pressable: (props: Record<string, unknown>) => createElement("button", props),
    Switch: ({ value, onValueChange, accessibilityLabel, ...props }: Record<string, unknown>) =>
      React.createElement("input", {
        type: "checkbox",
        role: "switch",
        checked: Boolean(value),
        "aria-label": accessibilityLabel,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          if (typeof onValueChange === "function") {
            onValueChange(event.target.checked);
          }
        },
        ...omitUiProps(props),
      }),
    StyleSheet: { create: (styles: unknown) => styles },
  };
});

vi.mock("expo-router", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  useFocusEffect: (callback: () => void | (() => void)) => {
    React.useEffect(() => {
      const cleanup = callback();
      return cleanup;
    }, [callback]);
  },
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    multiSet: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children, ...props }: Record<string, unknown>) =>
    createElement("div", { ...props, children }),
}));

vi.mock("react-native-keyboard-aware-scroll-view", () => ({
  KeyboardAwareScrollView: ({ children, ...props }: Record<string, unknown>) =>
    createElement("div", { ...props, children }),
}));

vi.mock("lucide-react-native", () => ({
  ArrowLeft: () => React.createElement("span", { "data-testid": "icon" }),
  Undo: () => React.createElement("span", { "data-testid": "icon" }),
  Redo: () => React.createElement("span", { "data-testid": "icon" }),
  ChevronsRight: () => React.createElement("span", { "data-testid": "icon" }),
  ArrowRight: () => React.createElement("span", { "data-testid": "icon" }),
  Shuffle: () => React.createElement("span", { "data-testid": "icon" }),
  Pencil: () => React.createElement("span", { "data-testid": "icon" }),
  CircleQuestionMark: () => React.createElement("span", { "data-testid": "icon" }),
}));

const mockUi = (name: string) => {
  const Component = ({ children, onPress, as, ...props }: Record<string, unknown>) => {
    if (as) {
      return React.createElement("span", { "data-testid": "icon", ...omitUiProps(props) });
    }
    return createElement("div", { "data-testid": name, onPress, ...props, children });
  };
  Component.displayName = name;
  return Component;
};

const buttonMock = ({
  children,
  onPress,
  disabled,
  isDisabled,
  ...props
}: Record<string, unknown>) =>
  createElement("button", {
    type: "button",
    onClick: disabled || isDisabled ? undefined : onPress,
    disabled: Boolean(disabled || isDisabled),
    ...omitUiProps(props),
    children,
  });

vi.mock("@/components/ui/box", () => ({ Box: mockUi("box") }));
vi.mock("@/components/ui/button", () => ({
  Button: buttonMock,
  ButtonText: ({ children }: { children: React.ReactNode }) =>
    React.createElement("span", null, children),
  ButtonSpinner: () => React.createElement("span", { "data-testid": "button-spinner" }),
  ButtonIcon: ({ children, as, ...props }: Record<string, unknown>) =>
    React.createElement(
      "span",
      { "data-testid": "button-icon", ...omitUiProps(props) },
      children as React.ReactNode,
    ),
}));
vi.mock("@/components/ui/heading", () => ({
  Heading: ({ children, ...props }: Record<string, unknown>) =>
    createElement("h1", { ...props, children }),
}));
vi.mock("@/components/ui/vstack", () => ({ VStack: mockUi("vstack") }));
vi.mock("@/components/ui/hstack", () => ({ HStack: mockUi("hstack") }));
vi.mock("@/components/ui/center", () => ({ Center: mockUi("center") }));
vi.mock("@/components/ui/divider", () => ({ Divider: () => React.createElement("hr") }));
vi.mock("@/components/ui/text", () => ({
  Text: ({ children, ...props }: Record<string, unknown>) =>
    createElement("span", { ...props, children }),
}));
vi.mock("@/components/ui/icon", () => ({
  Icon: ({ as, size, ...props }: Record<string, unknown>) =>
    React.createElement("span", { "data-testid": "icon", ...omitUiProps(props) }),
  ArrowLeftIcon: () => React.createElement("span"),
  CloseIcon: () => React.createElement("span"),
  CircleIcon: () => React.createElement("span"),
}));
vi.mock("@/components/ui/input", () => ({
  Input: mockUi("input"),
  InputField: (props: Record<string, unknown>) => createElement("input", props),
  InputSlot: mockUi("input-slot"),
  InputIcon: mockUi("input-icon"),
}));
vi.mock("@/components/ui/table", () => ({
  Table: mockUi("table"),
  TableHeader: mockUi("table-header"),
  TableHead: mockUi("table-head"),
  TableBody: mockUi("table-body"),
  TableRow: mockUi("table-row"),
  TableData: mockUi("table-data"),
}));
vi.mock("@/components/ui/modal", () => ({
  Modal: ({ children, isOpen }: { children: React.ReactNode; isOpen?: boolean }) =>
    isOpen ? React.createElement("div", { "data-testid": "modal" }, children) : null,
  ModalBackdrop: () => React.createElement("div"),
  ModalContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  ModalHeader: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  ModalBody: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  ModalFooter: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
}));
vi.mock("@/components/ui/radio", () => ({
  Radio: buttonMock,
  RadioGroup: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  RadioIndicator: mockUi("radio-indicator"),
  RadioIcon: mockUi("radio-icon"),
  RadioLabel: ({ children }: { children: React.ReactNode }) =>
    React.createElement("span", null, children),
}));
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({
    trigger,
    children,
  }: {
    trigger: (props: object) => React.ReactNode;
    children: React.ReactNode;
  }) => React.createElement("div", null, trigger({ onPress: vi.fn() }), children),
  TooltipContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  TooltipText: ({ children }: { children: React.ReactNode }) =>
    React.createElement("span", null, children),
}));
vi.mock("@/components/ui/gluestack-ui-provider", () => ({
  GluestackUIProvider: ({ children }: { children: React.ReactNode }) => children,
}));
