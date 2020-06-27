import dynamic from 'next/dynamic'

export const HomeOutlined = dynamic(
    () => import('@ant-design/icons/HomeOutlined'),
    { ssr: false }
)

export const CoffeeOutlined = dynamic(
    () => import('@ant-design/icons/CoffeeOutlined'),
    { ssr: false }
)

export const AppstoreOutlined = dynamic(
    () => import('@ant-design/icons/AppstoreOutlined'),
    { ssr: false }
)

export const CommentOutlined = dynamic(
    () => import('@ant-design/icons/CommentOutlined'),
    { ssr: false }
)

export const FireOutlined = dynamic(
    () => import('@ant-design/icons/FireOutlined'),
    { ssr: false }
)

export const BellOutlined = dynamic(
    () => import('@ant-design/icons/BellOutlined'),
    { ssr: false }
)

export const GithubOutlined = dynamic(
    () => import('@ant-design/icons/GithubOutlined'),
    { ssr: false }
)

export const SearchOutlined = dynamic(
    () => import('@ant-design/icons/SearchOutlined'),
    { ssr: false }
)

export const ClockCircleOutlined = dynamic(
    () => import('@ant-design/icons/ClockCircleOutlined'),
    { ssr: false }
)

export const EyeOutlined = dynamic(
    () => import('@ant-design/icons/EyeOutlined'),
    { ssr: false }
)

export const MessageOutlined = dynamic(
    () => import('@ant-design/icons/MessageOutlined'),
    { ssr: false }
)