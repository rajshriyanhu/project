import { formatDateString } from '@/lib/utils'
import { Trip } from '@/types'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CalendarIcon, MapPinIcon, UserIcon, WalletIcon } from 'lucide-react'

export default function TripDetails({trip} : {trip : Trip}) {
  return (
    <Card className="w-full max-w-3xl relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('/travel-details.jpg')`,
        }}
      />
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{trip.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg">{trip.destination}</span>
        </div>
        
        <p className="text-muted-foreground">{trip.description}</p>

        <div className="flex items-center gap-2">
          <WalletIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-medium">Budget: {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: trip.currency,
            }).format(trip.budget)}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <span>
            {formatDateString(trip.startDate)} - {formatDateString(trip.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-lg">{trip.users[0].user.firstName} {trip.users[0].user.lastName}</span>
            <span className="text-sm text-muted-foreground">{trip.users[0].user.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
