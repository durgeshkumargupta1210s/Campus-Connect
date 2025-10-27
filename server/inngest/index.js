import { Inngest } from "inngest";
import User from "../models/User.js";

// create a client to send and receive events
export const inngest=new Inngest({id:"event-ticket-booking"});

// Inngest Function to save user data to a database

const syncUserCreation = inngest.createFunction(
    {id:'sync-suer-from-clerk'},
    {event: 'clerk/user.created' },
    async({event})=>{
        const {id, first_name,last_name,email_addresses,image_url}=event.data
        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name: first_name+ " " + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

export const functions=[];