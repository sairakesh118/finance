import React, { Suspense } from 'react'

export const layout = ({children}) => {
  return (
    <div>
        <div className="flex flex-col h-screen">
            <main className="flex-1 p-4 bg-gray-100">
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </main>
        </div>
    </div>
  )
}
