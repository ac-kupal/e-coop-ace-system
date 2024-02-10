import db from "@/lib/database"

export const INIT_ROOT_ACCOUNT = async () => {
    return await db.user.create({
        data : {
            email : "cooperatives.cloud@gmail.com",
            name : "Coop Cloud",
            password : "$2a$10$iJFu3JszgpMfmDuqrSoD/e7XzVJdpEJRMQaPJFnAvAYo6xBLTiOeC",
            verified : true,
            branch : {
                create : {
                    branchName : "main branch",
                    branchAddress : "main address",
                    branchPicture : "/images/default.png",
                    branchDescription : "this is just an dummy branch"
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