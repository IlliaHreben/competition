import * as React from 'react';
import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  node: Node | null;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, node } = props;

  const trigger = useScrollTrigger({
    target: node as Node
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function HideAppBar({ children, node, ...props }: Props) {
  if (!node) return null;
  return (
    <HideOnScroll node={node}>
      <AppBar
        position="sticky"
        component="div"
        sx={{
          backgroundColor: 'white',
          marginBottom: 2
        }}
        {...props}
      >
        {children}
      </AppBar>
    </HideOnScroll>
  );
}
