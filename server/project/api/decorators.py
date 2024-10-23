from functools import wraps
from django.http import JsonResponse

ROLE_HIERARCHY = {
    'worker': 1,
    'librarian': 2,
    'manager': 3,
}

def role_required(min_role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user_role = request.user.role
            if ROLE_HIERARCHY.get(user_role, 0) >= ROLE_HIERARCHY.get(min_role, 0):
                return view_func(request, *args, **kwargs)
            return JsonResponse({'error': 'You do not have permission to perform this action.'}, status=403)
        return _wrapped_view
    return decorator