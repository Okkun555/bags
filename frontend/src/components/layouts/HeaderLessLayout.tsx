import { Box, Container, Typography } from "@mui/material";
import type React from "react";
import type { FC } from "react";

type HeaderLessLayoutProps = {
  pageTitle: string;
  children: React.ReactNode;
};

export const HeaderLessLayout: FC<HeaderLessLayoutProps> = ({
  pageTitle,
  children,
}) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4">{pageTitle}</Typography>
        {children}
      </Box>
    </Container>
  );
};
