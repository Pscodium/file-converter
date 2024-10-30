import React from 'react';

interface CompositeComponentProps extends React.ComponentProps<'div'> {
    children: React.ReactNode;
}

export default function CompositeComponent({ children, ...props }: CompositeComponentProps) {
    return <div {...props}>{children}</div>;
}
