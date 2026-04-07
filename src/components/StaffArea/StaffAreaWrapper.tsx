import Breadcrumbs, {Breadcrumb} from "components/Styling/Breadcrumbs";
import {Box, Container} from "@chakra-ui/react";
import React from "react";

type StaffAreaWrapperType = {
  breadcrumbs: Breadcrumb[]
  title: string,
  slug: string,
  children: any,
}

const StaffAreaWrapper = (props) => {
  const { breadcrumbs, children, title, slug, ...rest }: StaffAreaWrapperType = props

   return (
     <Box bgColor={"lightBlueLogo"}>
       <Box
         bgColor={"xlDarkBlueLogo"}
       >
         <Container
           size={"lg"}
         >
           <Breadcrumbs
             breadcrumbs={([
               {title: "Account", url: "/account"},
             ] as Breadcrumb[]).concat(breadcrumbs ?? [])
             }
             color={"white"}
           />
         </Container>
       </Box>
       <Container
         size={"lg"}
         py={"2rem"}
       >
       </Container>
     </Box>
   )
}