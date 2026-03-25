import { success } from "zod";

export default {
    months: {
        one: 'month',
        two: 'months',
        more: 'months',
    },
    years: {
        one: 'year',
        two: 'years',
        more: 'years',
    },
    present: 'Present',
    sections: {
        lets_talk: 'Let`s talk!',
        experience: 'Experience',
        education: 'Education',
        projects: 'Projects',
        related_projects: 'Related projects',
        about_project: 'About project',
    },
    labels: {
        print_version: 'Printed version',
        inn: 'INN', ogrn: 'OGRNIP',
        this_project_on_github: 'this project on github',
        this_cv_on_hh: 'this cv on hh.ru',
        this_cv_on_linkedin: 'this cv on linkedin',
        error: 'Error',
        success: 'Success',
        total_positions_duration: 'Total experience',
        position_description: 'Job description',
        stack: 'Technology stack',
        tags: 'Tags',
        about: 'About',
        links: 'Links',
        contact_me: 'Contact me!',
        lets_talk: 'Let`s talk!',
        more_about: "More about",
        current_locale: "Current language",
        back: 'Go back',
        anonymous: 'Anonymous'
    },
    pages: {
        index: 'Home',
    },
    form: {
        success: 'Thank you! Your request is sent! I contact you shortly',
        button: {
            submit: 'Send request',
            cancel: 'Cancel'
        },
        description: {
            label: 'Tell more about yourself or company',
            placeholder: 'Write here any info that you find interesting!',
            shortPlaceholder: 'Any interesting info',
        },
        telegram: {
            label: 'Telegram nickname',
        },
        phone: {
            label: 'Phone number',
        },
        email: {
            label: 'E-mail',
        },
        name: {
            label: 'Company name or yours',
            placeholder: 'How can i call you?'
        },
        legal: {
            leading: 'Pressing "Send request" button you accept:', 
            privacy: 'Privacy policy', 
            and: 'and',
            processing: 'Personal Data Processing Policy'
        },
        errors: {
            one_contact_required: 'At least one contact field is required!',
            name_required: 'Name is required',
            invalid_captcha: 'Captcha is invalid! Try again!',
            something_wrong: 'Something is wrong, message yоu send was invalid. Try again!'
        },
        contact: {
            label: 'How can i contact you?',
            button: 'Send contact',
        }
    }
}