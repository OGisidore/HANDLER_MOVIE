

const dbStructure = [
    {
        'tasks': [
            {
                primaryKey: '_id',
                indexes: [
                    { name: { unique: true } }
                ]
            }
        ]
    },
    {
        'users': [
            {
                primaryKey: '_id',
                indexes: []
            }
        ]
    },
    {
        'products': [
            {
                primaryKey: '_id',
                indexes: []
            }
        ]
    }
]