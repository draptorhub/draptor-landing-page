const payBtn = document.getElementById("payBtn");

payBtn.addEventListener("click", async () => {

    // GET INPUT VALUES
    const fullName = document
        .getElementById("fullName")
        .value
        .trim();

    const phoneNumber = document
        .getElementById("mobile")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const subject = "Github Workshop";



    // VALIDATION
    if (
        !fullName ||
        !phoneNumber ||
        !email
    ) {
        alert("Please fill all fields");
        return;
    }



    // EMAIL VALIDATION
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter valid email");
        return;
    }



    // PHONE VALIDATION
    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(phoneNumber)) {
        alert("Please enter valid mobile number");
        return;
    }



    // LOADING STATE
    payBtn.innerText = "Processing...";
    payBtn.disabled = true;



    try {

        // YOUR BACKEND URL
        const BASE_URL =
            "https://api.draptor.in/api/razorpay";



        // GET RAZORPAY KEY
        const keyResponse = await fetch(
            `${BASE_URL}/get-key`
        );

        const keyData =
            await keyResponse.json();




        // CREATE ORDER
        const orderResponse = await fetch(
            `${BASE_URL}/create-order`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    fullName,
                    phoneNumber,
                    email,
                    subject,
                    payment: 1,
                }),
            }
        );



        const orderData =
            await orderResponse.json();



        if (!orderData.success) {

            alert(orderData.message);

            payBtn.innerText =
                "Register & Pay ₹1";

            payBtn.disabled = false;

            return;
        }




        // RAZORPAY OPTIONS
        const options = {

            key: keyData.key,

            amount: orderData.order.amount,

            currency: "INR",

            name: "Draptor Technologies",

            description: "Github Workshop",

            order_id: orderData.order.id,

            image:
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",



            handler: async function (response) {

                try {

                    // VERIFY PAYMENT
                    const verifyResponse =
                        await fetch(
                            `${BASE_URL}/verify-payment`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },

                                body: JSON.stringify(
                                    response
                                ),
                            }
                        );



                    const verifyData =
                        await verifyResponse.json();



                    if (verifyData.success) {

                        // CLEAR INPUTS
                        document
                            .getElementById(
                                "fullName"
                            )
                            .value = "";

                        document
                            .getElementById(
                                "mobile"
                            )
                            .value = "";

                        document
                            .getElementById(
                                "email"
                            )
                            .value = "";



                        // SUCCESS BUTTON
                        payBtn.innerText =
                            "Registration Successful ✓";

                        payBtn.style.background =
                            "#16a34a";

                        payBtn.disabled = true;



                        // RESET AFTER 3 SECONDS
                        setTimeout(() => {

                            payBtn.innerText =
                                "Register & Pay ₹1";

                            payBtn.style.background =
                                "";

                            payBtn.disabled = false;

                        }, 3000);

                    } else {

                        alert(
                            "Payment Verification Failed"
                        );

                        payBtn.innerText =
                            "Register & Pay ₹1";

                        payBtn.disabled = false;
                    }

                } catch (error) {

                    console.log(error);

                    alert(
                        "Verification Error"
                    );

                    payBtn.innerText =
                        "Register & Pay ₹1";

                    payBtn.disabled = false;
                }
            },



            modal: {
                ondismiss: function () {

                    payBtn.innerText =
                        "Register & Pay ₹1";

                    payBtn.disabled = false;
                },
            },



            prefill: {
                name: fullName,
                email: email,
                contact: phoneNumber,
            },



            notes: {
                workshop:
                    "Github Workshop",
            },



            theme: {
                color: "#0f172a",
            },
        };




        // OPEN RAZORPAY
        const rzp =
            new Razorpay(options);




        // PAYMENT FAILED
        rzp.on(
            "payment.failed",
            function (response) {

                console.log(response);

                alert("Payment Failed");

                payBtn.innerText =
                    "Register & Pay ₹1";

                payBtn.disabled = false;
            }
        );



        rzp.open();

    } catch (error) {

        console.log(error);

        alert("Something went wrong");

        payBtn.innerText =
            "Register & Pay ₹1";

        payBtn.disabled = false;
    }
});