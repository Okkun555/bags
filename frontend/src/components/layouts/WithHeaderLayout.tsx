import type { FC } from "react";
import { AppHeader } from "./AppHeader";
import { Box, Container, Typography } from "@mui/material";

type WithHeaderLayoutProps = {
  pageTitle: string;
  children: React.ReactNode;
};

export const WithHeaderLayout: FC<WithHeaderLayoutProps> = ({
  pageTitle,
  children,
}) => (
  <>
    <AppHeader />
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4">{pageTitle}</Typography>
        {children}
      </Box>
    </Container>
  </>
);
