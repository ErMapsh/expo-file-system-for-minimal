import Ionicons from '@expo/vector-icons/Ionicons';

export const IoniconsIcon = ({ name, size = 24, color = 'black' }: { name: any, size?: number, color?: string }) => {
  return <Ionicons name={name} size={size} color={color} />;
};
