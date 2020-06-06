import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { ConfigProvider, DatePicker, message, Checkbox } from 'antd';

export default function Home() {
    useEffect(() => {
        setTimeout(() => {
            message.info('hello')
        }, 1000)
    }, [])

    return (
        <div>
            hello
            <Checkbox>Checkbox</Checkbox>
        </div>
    )
}