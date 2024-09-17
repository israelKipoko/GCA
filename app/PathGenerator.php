namespace App;

use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CustomPathGenerator implements PathGenerator
{
    /*
     * Get the path for the given media, including the filename.
     */
    public function getPath(Media $media): string
    {
        return 'custom_directory/' . $media->id . '/';
    }

    /*
     * Get the path for conversions of the given media, including the filename.
     */
    public function getPathForConversions(Media $media): string
    {
        return 'custom_directory/' . $media->id . '/conversions/';
    }

    /*
     * Get the path for responsive images of the given media, including the filename.
     */
    public function getPathForResponsiveImages(Media $media): string
    {
        return 'custom_directory/' . $media->id . '/responsive-images/';
    }
}
