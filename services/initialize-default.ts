import db from "@/lib/database"

export const INIT_ROOT_ACCOUNT = async () => {
    return await db.user.create({
        data : {
            email : "initialacc@gmail.com",
            name : "initial root",
            password : "$2a$10$iJFu3JszgpMfmDuqrSoD/e7XzVJdpEJRMQaPJFnAvAYo6xBLTiOeC",
            verified : true,
            branch : {
                create : {
                    branchName : "initial branch",
                    branchAddress : "initial address",
                    branchPicture : "/picture/default.png",
                    branchDescription : "this is just an initial branch"
                }
            },
            roles : {
                create : [
                    { 
                        role : "root"
                    },
                    { 
                        role : "admin"
                    },
                    { 
                        role : "staff"
                    }
                ]
            }
        }
    })
}