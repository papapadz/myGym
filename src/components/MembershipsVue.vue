<template>
    <ion-list>
      <ion-item-group v-for="group in groups" :key="group.year + group.month">
        <ion-item-divider color="primary">{{ group.year }} - {{ months[group.month - 1] }}</ion-item-divider>
        <ion-item v-for="date in group.dates" :key="date.id">
          {{ formatDate(date.date) }} 
        </ion-item>
      </ion-item-group>
    </ion-list>
  </template>
  
  <script>
  export default {
    props: ['membershipData'],
    data() {
      return {
        dates: this.memberShipData,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }
    },
    computed: {
        groups() {
            if (!this.dates || this.dates.length === 0) {
                return []
            }
            const arr = this.dates.map(date => ({ id: date.id, date: new Date(date.created_at) }))
            return arr.reduce((acc, curr) => {
            const year = curr.date.getFullYear()
            const month = curr.date.getMonth() + 1
            const exists = acc.find(a => a.year === year && a.month === month)
            if (exists) {
                exists.dates.push(curr)
            } else {
                acc.push({ year, month, dates: [curr] })
            }
            console.log(acc)
            return acc
            }, [])
        }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = this.months[date.getMonth()]
        const day = date.getDate()
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return `${month} ${day}, ${year}, ${time}`
      },
    }
  }
  </script>
  