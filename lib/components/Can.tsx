import React from 'react';
import { canAllow, checkPermissions, Rules, TestRules } from 'ts-can';
import { useAuthorization } from './Authorization';

/**
 * A function type that represents a render function.
 * @param allowed - A boolean parameter indicating whether the rendering is allowed.
 * @returns A React node.
 */
export type CanRenderFunction = (allowed: boolean) => React.ReactNode;

/**
 * Props of Can and Cannot component
 * @property { TestRules } test - Represents a collection of test rules, where each key is a string representing a rule name, and the corresponding value is a Rules object.
 * @property { React.ReactNode | CanRenderFunction } children - Children type that can be sent for validation in Can and Cannot components.
 */
export type ICan = Rules & {
  test?: TestRules;
  children: React.ReactNode | CanRenderFunction;
};
/**
 * Type representing the properties of a component for displaying content.
 */
export type IDisplayContent = {
  children: React.ReactNode | CanRenderFunction;
};

/**
 * React component type that cannot be rendered based on authorization rules.
 * @template P - The props type for the component.
 */
export interface CannotType extends React.FC<ICan> {
  /**
   * A component for rendering content when a condition fails.
   */
  Fail: React.FC<IDisplayContent>;
  /**
   * A component for rendering content when a condition passes.
   */
  Pass: React.FC<IDisplayContent>;
}

/**
 * React component type that can be rendered based on authorization rules.
 * @template P - The props type for the component.
 */
export interface CanType extends CannotType {
  /**
   * A component for rendering content when a condition is not met.
   */
  Not: CannotType;
}

const displayContent = (
  props: IDisplayContent,
  allowed: boolean,
): React.ReactNode => {
  if (typeof props.children === 'function') {
    return <React.Fragment>{props.children(allowed)}</React.Fragment>;
  }
  const numberOfChildren: number = React.Children.count(props.children);
  const filteredChildren: React.ReactNode[] = React.Children.map(
    props.children,
    (child: any) => {
      if (!child) {
        return;
      }
      if (child.type === ConditionPass) {
        if (allowed) {
          return child;
        }
        return;
      }
      if (child.type === ConditionFail) {
        if (!allowed) {
          return child;
        }
        return;
      }
      return child;
    },
  );
  if (React.Children.count(filteredChildren) !== numberOfChildren) {
    return filteredChildren;
  }
  if (!allowed) {
    return null;
  }
  return <React.Fragment>{props.children}</React.Fragment>;
};
/**
 * React component for rendering content when a condition passes.
 */
const ConditionPass: React.FC<{ children: React.ReactNode }>= ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
);
/**
 * React component for rendering content when a condition fails.
 */
const ConditionFail: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
);

const Can: CanType = (props: ICan): React.ReactElement => {
  const permissions = useAuthorization();
  let allowed;
  if (props.test) {
    allowed = canAllow(permissions, props.test);
  } else {
    allowed = canAllow(permissions, {
      [(props.module as string)]: {
        ...props,
      },
    });
  }
  return <>{displayContent(props, allowed)}</>;
};

const Cannot: CannotType = (props: ICan): React.ReactElement => {
  const permissions = useAuthorization();
  const allowed = checkPermissions(permissions, props);
  return <>{displayContent(props, !allowed)}</>;
};

Can.Pass = ConditionPass as React.FC<IDisplayContent>;
Cannot.Pass = ConditionPass as React.FC<IDisplayContent>;
Can.Fail = ConditionFail as React.FC<IDisplayContent>;
Cannot.Fail = ConditionFail as React.FC<IDisplayContent>;
Can.Not = Cannot;

export { Can, Cannot };
