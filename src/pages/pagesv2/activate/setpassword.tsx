import { Flex, Input } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import React from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"

export default function SetPassword() {
  const validationSchema = Yup.object().shape({})

  const formOptions = {
    resolver: yupResolver(validationSchema),
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm(formOptions)
  return (
    <Flex>
      <Input />
    </Flex>
  )
}
