import React from 'react'
import { StyleSheet } from 'react-native'
import { Redirect } from 'expo-router'

export default function Layout() {
  return <Redirect href='/consumer/' />
}

const styles = StyleSheet.create({})
