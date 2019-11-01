import {AbstractControl} from '@angular/forms';

export function passwordConfirmValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return password.value !== confirmPassword.value ? {misMatch : true} : null;;
}
