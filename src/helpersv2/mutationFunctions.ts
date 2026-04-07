import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendData } from "../hooks/useQueryHook"

type addMessage = {
  subject: String
  message: String
  status: Boolean
  client?: any
  id?: number
  authorId?: number
  sender?: number[]
  recipients?: number[]
}
