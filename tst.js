[
    {
        $match: {
            days: "Mon"
        }
    },
    {
        $addFields: {
            endDateTime: {
                $dateFromString: {
                    dateString: {
                        $concat: [
                            {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: new Date()
                                }
                            },
                            "T",
                            "$endTime",
                            ":00Z"
                        ]
                    }
                }
            },
            startDateTime: {
                $dateFromString: {
                    dateString: {
                        $concat: [
                            {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: new Date()
                                }
                            },
                            "T",
                            "$startTime",
                            ":00Z"
                        ]
                    }
                }
            }
        }
    },
    {
        $match: {
            endDateTimeIST: {
                $lt: {
                    $dateAdd: {
                        startDate: new Date(),
                        unit: "hour",
                        amount: 5.5
                    }
                }
            },
            startDateTimeIST: {
                $gt: {
                    $dateAdd: {
                        startDate: new Date(),
                        unit: "hour",
                        amount: 5.5
                    }
                }
            }
        }
    },
    {
        $sort: {
            endDateTime: -1
        }
    }
]