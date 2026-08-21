import type { FC } from "react";
import { AppHeader } from "./AppHeader";
import { Box, Container, Typography } from "@mui/material";

type WithHeaderLayoutProps = {
  pageTitle: string;
  description?: string;
  children: React.ReactNode;
};

export const WithHeaderLayout: FC<WithHeaderLayoutProps> = ({
  pageTitle,
  description,
  children,
}) => (
  <>
    <AppHeader />
    <Container sx={{ mt: 12 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {pageTitle}
      </Typography>
      {description && <Typography variant="h6">{description}</Typography>}
      <Box sx={{ mt: 4 }}>{children}</Box>
    </Container>
  </>
);
