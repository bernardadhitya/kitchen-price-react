export const actions = {
  'service': {
    'WAITING-CONFIRMATION': [
      {
        'title': 'Tolak Permintaan',
        'color': '#FF4133',
        'style': 'outline',
        'action': 'reject'
      },
      {
        'title': 'Terima Permintaan',
        'color': '#1A3E60',
        'style': 'fill',
        'action': 'next'
      }
    ],
    'WAITING-PAYMENT': [],
    'WAITING-PROGRESS': [
      {
        'title': 'Proses Permintaan',
        'color': '#1A3E60',
        'style': 'fill',
        'action': 'next'
      }
    ],
    'IN-PROGRESS': [
      {
        'title': 'Permintaan Selesai',
        'color': '#1A3E60',
        'style': 'fill',
        'action': 'next'
      }
    ],
    'DONE': [],
    'REJECTED': [],
  },
  'business': {
    'WAITING-CONFIRMATION': [],
    'WAITING-PAYMENT': [
      {
        'title': 'Bayar',
        'color': '#1A3E60',
        'style': 'fill',
        'action': 'next'
      }
    ],
    'WAITING-PROGRESS': [],
    'IN-PROGRESS': [],
    'DONE': [],
    'REJECTED': [],
  }
}