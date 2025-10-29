// utils/fonts.js
import { Platform } from 'react-native';

export const fonts = {
  // Playfair Display (serif font for headings)
  playfairBold: Platform.select({
    ios: 'PlayfairDisplay-Bold',
    android: 'PlayfairDisplay-Bold',
    default: 'serif',
  }),
  playfairSemiBold: Platform.select({
    ios: 'PlayfairDisplay-SemiBold',
    android: 'PlayfairDisplay-SemiBold',
    default: 'serif',
  }),
  playfairRegular: Platform.select({
    ios: 'PlayfairDisplay-Regular',
    android: 'PlayfairDisplay-Regular',
    default: 'serif',
  }),
  
  // Montserrat (sans-serif font for body text)
  montserratBold: Platform.select({
    ios: 'Montserrat-Bold',
    android: 'Montserrat-Bold',
    default: 'sans-serif',
  }),
  montserratSemiBold: Platform.select({
    ios: 'Montserrat-SemiBold',
    android: 'Montserrat-SemiBold',
    default: 'sans-serif',
  }),
  montserratMedium: Platform.select({
    ios: 'Montserrat-Medium',
    android: 'Montserrat-Medium',
    default: 'sans-serif',
  }),
  montserratRegular: Platform.select({
    ios: 'Montserrat-Regular',
    android: 'Montserrat-Regular',
    default: 'sans-serif',
  }),
};

export const colors = {
  bronze: '#8B6F47',
  amber: '#C17E3A',
  parchment: '#F5F0E8',
  mossGreen: '#4A7C59',
  terracotta: '#A8402E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#666666',
  lightGray: '#E0E0E0',
};
