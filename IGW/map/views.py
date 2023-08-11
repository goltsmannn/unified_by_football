from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
import jinja2
from map.models import Placemark, ReviewPictures, Review
from django.views.generic import TemplateView


class MainPageTemplateView(TemplateView):
    template_name = 'map/main_map.html'


def show_details(request, pk):
    pictures = ReviewPictures.objects.select_related('review', 'review__placemark').filter(review__placemark__pk=pk)
    context = {
        'pictures': pictures
    }
    return render(request, 'map/map_details.html', context)
