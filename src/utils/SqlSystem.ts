import * as SQLite from "expo-sqlite";
export const table_name = 'offline_videos';

export const db = SQLite.openDatabase(`GoRoga`);

export const initDB = () => {
    try {
        db.transaction((tx: any) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS ${table_name} (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content_id INTEGER,
                    fileName TEXT,
                    downloadState TEXT,
                    videoPath TEXT,
                    imgPath TEXT,
                    percentage TEXT,
                    metadata TEXT
                )`,
                [],

                () => {
                    console.log('Table created successfully');
                },
                (txObj: any, error: any) => {
                    console.log('Error creating table: ', error);
                    return false;
                }
            );
        });
    } catch (error) {
        console.log("Error:", error);
    }
};

// get all data
export const getOfflineStatus = () => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${table_name};`,
                [],
                (txObj, resultSet) => {
                    console.log('====================================');
                    console.log('\nRetrieved data: ', resultSet.rows._array);
                    console.log('====================================');
                    return resultSet.rows._array;
                },
                (txObj, error) => {
                    console.error('Error retrieving data:', error);
                    return false;
                }
            );
        });
    } catch (error) {
        console.error('Error in retrieveData:', error);
        return false
    }
};

// add file when download starts
export const addFileRecord = (req: {
    id: string | number,
    fileName: string,
    downloadState: "DOWNLOAD" | "PREPARING" | "DOWNLOADING" | "PAUSED" | "DONE",
    videoPath?: string,
    imgPath?: string,
    percentage?: number,
    metadata: any,
}) => {
    const { id, fileName, downloadState, metadata } = req;

    // Check if content_id already exists in the table
    db.transaction(tx => {
        tx.executeSql(
            `SELECT COUNT(*) AS count FROM ${table_name} WHERE content_id = ?;`,
            [id],
            (_, result) => {
                const count = result.rows.item(0).count;
                if (count === 0) {
                    // If no record exists, insert the new one
                    tx.executeSql(
                        `INSERT INTO ${table_name} (content_id, fileName, downloadState, imgPath, videoPath, metadata) VALUES (?, ?, ?, ?, ?, ?);`,
                        [id, fileName, downloadState, null, null, metadata],
                        () => {
                            console.log('Data inserted');
                        },
                        (txObj: any, error: any) => {
                            console.log('Error while inserting data: ', error);
                            return false;
                        }
                    );
                } else {
                    console.log('Content ID already exists. No insertion.');
                }
            },
            (txObj: any, error: any) => {
                console.log('Error while checking for existing content ID: ', error);
                return false;
            }
        );
    });
};

// update on donwload complete
export const updateOnDownloadComplete = ({
    id,
    videoPath
}: {
    id: string | number,
    videoPath: string
}) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE ${table_name} SET downloadState = ?, videoPath = ? WHERE content_id = ?;`,
            ["DONE", videoPath, id],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    console.log(`Download state and videoPath updated successfully for content_id: ${id}`);
                } else {
                    console.log(`No record found with content_id: ${id}`);
                }
            },
            (txObj: any, error: any) => {
                console.log('Error while updating download state and videoPath: ', error);
                return false;
            }
        );
    });
};

// get data by content id
export const getRecordByContentId = (contentId: string | number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM ${table_name} WHERE content_id = ?;`,
                [contentId],
                (_, result) => {
                    if (result.rows.length > 0) {
                        const record = result.rows.item(0);
                        resolve(record); // Resolve the Promise with the record
                    } else {
                        resolve(false); // Resolve with false if no record is found
                    }
                },
                (txObj, error) => {
                    console.error('SQL Error:', error);
                    reject(error); // Reject the Promise on error
                    return false; // Return true to indicate that the error was handled
                }
            );
        });

    });
};

// update download state over content id
export const updateDownloadState = ({ id, newState }: { id: string | number, newState: "DOWNLOAD" | "PREPARING" | "DOWNLOADING" | "PAUSED" | "DONE" }) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE ${table_name} SET downloadState = ? WHERE content_id = ?;`,
            [newState, id],
            () => {
                console.log(`Download state updated to ${newState} for content_id ${id}`);
            },
            (txObj: any, error: any) => {
                console.log('Error while updating download state: ', error);
                return false;
            }
        );
    });
};

// update download state over content id
export const updateWhenPauseDownloadState = ({
    id,
    newState,
    percentage
}: {
    id: string | number,
    newState: "DOWNLOAD" | "PREPARING" | "DOWNLOADING" | "PAUSED" | "DONE",
    percentage: string
}) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE ${table_name} SET downloadState = ?, percentage = ? WHERE content_id = ?;`,
            [newState, percentage, id],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    console.log(`Download state updated to ${newState} and percentage set to ${percentage} for content_id ${id}`);
                } else {
                    console.log(`No record found with content_id: ${id}`);
                }
            },
            (txObj: any, error: any) => {
                console.log('Error while updating download state and percentage: ', error);
                return false;
            }
        );
    });
};


// remove row of content id
export const removeFileRecord = (id: string | number) => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM ${table_name} WHERE content_id = ?;`,
            [id],
            () => {
                console.log(`Row with content_id ${id} deleted`);
            },
            (txObj: any, error: any) => {
                console.log('Error while deleting data: ', error);
                return false;
            }
        );
    });
};

/* only done donwloads */
export const getDoneRecords = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM ${table_name} WHERE downloadState = 'DONE';`,
                [],
                (_, result) => {
                    const records = [];
                    for (let i = 0; i < result.rows.length; i++) {
                        records.push(result.rows.item(i));
                    }
                    resolve(records); // Resolve the Promise with an array of records
                },
                (txObj, error) => {
                    console.error('SQL Error:', error);
                    reject(error); // Reject the Promise on error
                    return false; // Return true to indicate that the error was handled
                }
            );
        });
    });
};


