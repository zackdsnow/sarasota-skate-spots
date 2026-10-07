const SUPABASE_URL =
    "https://uodfjhlrcwlvkbeywtkb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_IVFTXM3MwOjIQNJogVlgnQ_scPbWYJZ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const skateLocations = {

    payne: {
        name: "Payne Skate Park",
        type: "Skate Park",

        lat: 27.3339318,
        lng: -82.5278391,

        approximate: false,

        address:
            "2010 Adams Lane, Sarasota, FL 34237",

        maps:
            "https://www.google.com/maps/search/?api=1&query=Payne+Park+2010+Adams+Lane+Sarasota+FL"
    },

    selby: {
        name: "The Selby Library",
        type: "Ledge",

        lat: 27.3387,
        lng: -82.5364,

        approximate: true
    },

    smh: {
        name: "SMH Hospital Rail",
        type: "Rail",

        lat: 27.3168,
        lng: -82.5270,

        approximate: true
    },

    marina: {
        name: "Marina Jack's Ledge",
        type: "Ledge",

        lat: 27.3330,
        lng: -82.5469,

        approximate: true
    },

    mainstreet: {
        name: "Main Street Flat Bar",
        type: "Flat Bar",

        lat: 27.3365,
        lng: -82.5345,

        approximate: true
    },

    aloft: {
        name: "Aloft Ledges",
        type: "Ledge",

        lat: 27.3397,
        lng: -82.5410,

        approximate: true
    },

    geckos: {
        name: "Gecko's Rail",
        type: "Rail",

        lat: 27.3200,
        lng: -82.5310,

        approximate: true
    },

    pineview: {
        name: "Pine View Rail",
        type: "Rail",

        lat: 27.1800,
        lng: -82.4830,

        approximate: true
    },

    hollywood20: {
        name: "Hollywood 20 Gap",
        type: "Gap",

        lat: 27.3370,
        lng: -82.5360,

        approximate: true
    }

};


const map =
    L.map("skateMap").setView(
        [27.3360, -82.5300],
        13
    );


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,

        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


const markers = {};


Object.entries(skateLocations).forEach(
    ([id, location]) => {

        const marker =
            L.marker([
                location.lat,
                location.lng
            ]).addTo(map);


        let popup = `
            <strong>
                ${escapeHtml(location.name)}
            </strong>

            <br>

            ${escapeHtml(location.type)}
        `;


        if (location.approximate) {

            popup += `
                <br>
                <small>
                    Approximate location
                </small>
            `;

        }


        if (location.address) {

            popup += `
                <br>
                <small>
                    ${escapeHtml(location.address)}
                </small>
            `;

        }


        const mapsUrl =
            location.maps ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location.name + " Sarasota FL"
            )}`;


        popup += `
            <br><br>

            <a
                href="${mapsUrl}"
                target="_blank"
                rel="noopener"
            >
                OPEN IN GOOGLE MAPS →
            </a>
        `;


        marker.bindPopup(popup);

        markers[id] = marker;

    }
);


function focusLocation(id) {

    const location =
        skateLocations[id];

    const marker =
        markers[id];


    if (!location || !marker) {
        return;
    }


    map.setView(
        [
            location.lat,
            location.lng
        ],
        16
    );


    marker.openPopup();

}


function filterSpots(type, button) {

    const cards =
        document.querySelectorAll(
            "#spots .spot-card"
        );


    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(item => {

        item.classList.remove(
            "active"
        );

    });


    button.classList.add(
        "active"
    );


    cards.forEach(card => {

        if (
            type === "all" ||
            card.dataset.type === type
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


async function loadProfiles() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("skater_profiles")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        return;
    }


    const list =
        document.getElementById(
            "profilesList"
        );


    list.innerHTML =
        data.map(profile => `

            <article class="community-card">

                <h3>
                    ${escapeHtml(profile.name)}
                </h3>

                <p>
                    <strong>
                        Style:
                    </strong>

                    ${escapeHtml(profile.style)}
                </p>

                <p>
                    <strong>
                        Favorite spot:
                    </strong>

                    ${escapeHtml(
                        profile.favorite_spot
                    )}
                </p>

                <p>
                    ${escapeHtml(profile.bio)}
                </p>

            </article>

        `).join("");

}


async function loadEvents() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("skate_events")
            .select("*")
            .order(
                "event_date",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(error);

        return;
    }


    const list =
        document.getElementById(
            "eventsList"
        );


    list.innerHTML =
        data.map(event => `

            <article class="community-card">

                <h3>
                    ${escapeHtml(event.name)}
                </h3>

                <p>
                    <strong>
                        Date:
                    </strong>

                    ${escapeHtml(
                        event.event_date
                    )}
                </p>

                <p>
                    <strong>
                        Location:
                    </strong>

                    ${escapeHtml(
                        event.location
                    )}
                </p>

                <p>
                    ${escapeHtml(
                        event.description
                    )}
                </p>

            </article>

        `).join("");

}


document
    .getElementById("profileForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const profile = {

                name:
                    document
                        .getElementById(
                            "profileName"
                        )
                        .value
                        .trim(),

                style:
                    document
                        .getElementById(
                            "profileStyle"
                        )
                        .value
                        .trim(),

                favorite_spot:
                    document
                        .getElementById(
                            "profileSpot"
                        )
                        .value
                        .trim(),

                bio:
                    document
                        .getElementById(
                            "profileBio"
                        )
                        .value
                        .trim()

            };


            const {
                error
            } =
                await supabaseClient
                    .from("skater_profiles")
                    .insert([
                        profile
                    ]);


            if (error) {

                alert(
                    "Could not create profile."
                );

                console.error(error);

                return;
            }


            event.target.reset();

            await loadProfiles();

            alert(
                "Profile added!"
            );

        }
    );


document
    .getElementById("eventForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const skateEvent = {

                name:
                    document
                        .getElementById(
                            "eventName"
                        )
                        .value
                        .trim(),

                event_date:
                    document
                        .getElementById(
                            "eventDate"
                        )
                        .value,

                location:
                    document
                        .getElementById(
                            "eventLocation"
                        )
                        .value
                        .trim(),

                description:
                    document
                        .getElementById(
                            "eventDescription"
                        )
                        .value
                        .trim()

            };


            const {
                error
            } =
                await supabaseClient
                    .from("skate_events")
                    .insert([
                        skateEvent
                    ]);


            if (error) {

                alert(
                    "Could not add event."
                );

                console.error(error);

                return;
            }


            event.target.reset();

            await loadEvents();

            alert(
                "Event added!"
            );

        }
    );


loadProfiles();

loadEvents();
