import React from 'react'
import { Redirect } from 'expo-router'
import { useAuthStore } from '@store/auth.store'
import { preference } from '@store/preference'

export default function App() {

  const { user } = useAuthStore()
  const role = preference.getRole()
  if (user) {
    if (role === 'provider') {
      return <Redirect href={'/provider/'} />
    }
    if (role === 'consumer') {
      return <Redirect href={'/consumer/'} />
    }
    return <Redirect href={'/choose-role'} />
  }

  return <Redirect href={'/auth/'} />
}

